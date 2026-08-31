# Git Workflow - SmartTobi Team (Pro)

> Trunk-Based + GitHub Flow lai, chuẩn cho team 3-10 dev, CI/CD nhanh.

## 1. Branches
| Branch | Mô tả | Bảo vệ |
|---|---|---|
| `main` | Production, luôn deployable, tag `vX.Y.Z` | Protected, require PR + CI pass + CODEOWNERS approve |
| `develop` | Integration, gom feature xong mới merge vào main | Protected, require CI pass |
| `feature/*` | Mỗi US 1 branch, vd `feature/US-202-queue` | - |
| `hotfix/*` | Fix prod, branch từ main | - |
| `release/*` | Chuẩn bị release, chỉ fix bug | - |

**Không dùng GitFlow nặng (không có release/develop quá phức tạp nếu team <10). Chọn Trunk-Based:**

```
main  ──●──●──●──●──●──●──● (luôn xanh, CI pass)
         \  \  \  \
feature   ●  ●  ●  ●  -> PR -> Squash Merge -> main
```

Nếu team muốn GitFlow đầy đủ, dùng `develop` làm trunk, `main` chỉ release.

## 2. Commit Convention (Conventional Commits)
```
<type>(<scope>): <subject>

feat(flash): US-202 add queue priority via Redis ZSet
fix(live): US-302 fix chat latency >150ms
docs(prd): update smart.tobi package naming
refactor(catalog): extract StockPort hexagonal
test(flash): add k6 oversell test 10k VU
chore(ci): add github actions ci
```

**Types:** feat, fix, docs, style, refactor, test, chore, perf, build, ci
**Scope:** flash, live, feed, logistics, wallet, user, catalog, common, web, ci, docs

Enforced by `commitlint` + `husky` pre-commit.

## 3. Branch Naming
```
feature/US-202-queue-priority
feature/US-301-live-room
bugfix/US-204-oversell-lua
hotfix/inventory-negative
chore/setup-ci
```

## 4. PR Process
1. Tạo branch từ `main` (hoặc `develop` nếu team chọn)
2. Commit atomic, mỗi commit pass build
3. Push + tạo PR template (đã có `.github/PULL_REQUEST_TEMPLATE.md`)
4. Yêu cầu: `CI green` + `1 approve từ CODEOWNERS` + `không conflict`
5. Squash Merge (giữ history sạch), xóa branch

## 5. Versioning & Tagging
- SemVer: `v1.0.0`, `v1.1.0`, `v1.0.1-hotfix`
- Tag khi merge vào main: `git tag -a v0.1.0 -m "MVP flash sale"`

## 6. Hooks
- `pre-commit`: lint (java google format + eslint), commitlint
- `pre-push`: run unit test nhanh
- Cài: `npm run prepare` (husky) ở root, `mvn spotless:check` ở backend

## 7. Lệnh mẫu
```bash
git checkout main && git pull
git checkout -b feature/US-202-queue
# code ...
git commit -m "feat(flash): US-202 queue fair FIFO"
git push -u origin feature/US-202-queue
# tạo PR trên GitHub -> review -> squash merge
```

## 8. CODEOWNERS
File `.github/CODEOWNERS` đã định nghĩa owner per module `smart.tobi.*`

## 9. Protection Rules (cấu hình trên GitHub)
- Settings -> Branches -> Add rule cho `main`:
  - Require PR before merging
  - Require status checks: `ci-backend`, `ci-web`, `test`
  - Require conversation resolution
  - Do not allow bypass
