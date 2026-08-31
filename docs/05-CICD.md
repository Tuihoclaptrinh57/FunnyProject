# CI/CD - SmartTobi (Foundation -> Pro)

## 1. Tổng quan Pipeline

```
Dev local (husky pre-commit) 
  -> Push feature/* 
  -> PR -> CI (lint-commit + backend test + web build + docker build)  [ci.yml]
  -> Merge to develop -> Deploy staging.smart.tobi (auto)             [cd.yml staging]
  -> PR develop -> main -> Deploy prod + Release tag v*               [cd.yml release]
  -> CodeQL weekly scan                                                [codeql.yml]
```

## 2. Foundation (Đã có sẵn, chạy được ngay)

| File | Trigger | Việc làm |
|---|---|---|
| `.github/workflows/ci.yml` | push/PR main,develop | commitlint, backend mvn verify (postgres+redis service), web lint+build, docker build (no push) |
| `.github/workflows/cd.yml` | push main, tag v* | build push GHCR + deploy placeholder (k8s/helm) |
| `.github/workflows/codeql.yml` | push/PR + weekly | scan Java + JS |
| `commitlint.config.js` + `package.json:prepare` | pre-commit | enforce Conventional Commits |

**Chạy local giống CI:**
```bash
# backend
cd backend && mvn verify

# web
npm ci && npm run lint && npm run build --workspace=apps/web

# commit
git commit -m "feat(flash): US-202 queue"
npx commitlint --from=HEAD~1
```

## 3. Pro - Quality Gates (bật dần khi team lớn)

1.  **SonarCloud:** thêm job `sonar` trong ci.yml, gate coverage >80% cho smart.tobi.flash (core)
2.  **Trivy scan:** scan docker image `aquasecurity/trivy-action`
3.  **k6 load test:** job `k6` chỉ chạy khi label `perf` hoặc push vào flash module
    ```yaml
    - uses: grafana/k6-action@v0.3.0
      with: { filename: tests/k6/flash-oversell.js }
    ```
4.  **Preview Deploy (Vercel):** web PR auto deploy preview `https://pr-123.web.smart.tobi`
5.  **Branch Protection:** Settings -> Branches -> Require `backend`, `web`, `lint-commit` pass

## 4. Environments

| Env | Branch | URL | Deploy |
|---|---|---|---|
| Dev | feature/* | localhost:3000 / :8080 | docker-compose up |
| Staging | develop | staging.smart.tobi / api.staging.smart.tobi | auto cd.yml |
| Prod | main + tag v* | smart.tobi / api.smart.tobi | manual approve + cd.yml |

Secrets cần add trên GitHub: `GHCR_TOKEN`, `KUBE_CONFIG`, `VERCEL_TOKEN`

## 5. Docker Strategy

- Multi-stage: `backend` (eclipse-temurin:25-jre) + `web` (node:20 -> nginx)
- Single `Dockerfile` ở root build cả 2, hoặc 2 Dockerfile riêng `backend/Dockerfile`, `apps/web/Dockerfile`
- Tag: `ghcr.io/<org>/smart-tobi:staging-${sha}`, `ghcr.io/<org>/smart-tobi:v1.2.3`

## 6. Release Flow
```bash
git checkout main && git pull
git tag -a v0.1.0 -m "MVP flash sale"
git push origin v0.1.0  # trigger cd.yml release job -> tạo GitHub Release
```

## 7. Next Steps
- [ ] Add `backend/pom.xml` để CI backend chạy thật (thay vì skip)
- [ ] Add `apps/web` để CI web chạy thật
- [ ] Enable branch protection + required status checks
- [ ] Add Sonar + Trivy khi code >5k LOC
