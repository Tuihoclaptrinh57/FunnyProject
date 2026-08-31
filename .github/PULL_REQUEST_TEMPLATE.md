<!-- SmartTobi PR Template -->
## Description
Closes # (issue)

## Type
- [ ] feat
- [ ] fix
- [ ] refactor
- [ ] docs / chore / test

## Module
- [ ] smart.tobi.flash
- [ ] smart.tobi.live
- [ ] smart.tobi.feed
- [ ] smart.tobi.logistics
- [ ] smart.tobi.wallet
- [ ] smart.tobi.user / catalog / common
- [ ] web (Next.js)

## Checklist
- [ ] Hexagonal: domain không dính Spring, logic qua port/in
- [ ] Tests: unit + integration (Testcontainers nếu đụng DB/Redis)
- [ ] Docs: update PRD/US/ADR nếu thay đổi architect
- [ ] Conventional Commits: `feat(scope): ...`
- [ ] Không vi phạm 4 tầng cache Next.js (nếu đụng web)
- [ ] k6 / load test nếu là P0 (flash sale)

## Screenshots / API
```
```

## DSA / Architect note
> Ghi rõ DSA/algo dùng (Heap, Lua, BFS, GEO...) và tại sao chose

