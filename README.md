# SmartTobi SuperApp - smart.tobi

> SuperApp gộp 4 ý tưởng: Flash Sale + Live Commerce (CORE) + Social Feed AI + Logistics + Wallet/Collab. Backend Hexagonal Modular Monolith -> Microservices.

**Branding:** `smart.tobi` | **Packages:** `smart.tobi.*` | **Domains:** `flash.smart.tobi`, `live.smart.tobi`, `feed.smart.tobi`, `api.smart.tobi`
**Stack:** Next.js 15 (PPR, RSC) + Spring Boot 4.0 + Java 25 (Virtual Threads) + PostgreSQL + Redis + Kafka + Qdrant

## Docs
- [00 - Overview](docs/00-OVERVIEW.md) - Cách gộp 4 modules thành 1 journey
- [01 - PRD](docs/01-PRD.md) - Vision, Modules smart.tobi.*, FR/NFR
- [02 - User Stories](docs/02-USER-STORIES.md) - 6 Epics, 32 US, AC Gherkin
- [03 - Architecture](docs/03-ARCHITECTURE.md) - Hexagonal smart.tobi.* + Next.js 4-tier cache + Migration
- [04 - Git Workflow](docs/04-GIT-WORKFLOW.md) - Trunk-based, Conventional Commits, PR template
- [05 - CI/CD](docs/05-CICD.md) - Foundation -> Pro (ci/cd/codeql, GHCR, k8s)

## Quick Start
```bash
docker-compose up -d  # postgres, redis, kafka, qdrant
# Backend: smart.tobi monolith
cd backend && mvn spring-boot:run  # :8080 api.smart.tobi
# Frontend: Next.js 15
cd apps/web && npm install && npm run dev  # :3000
```

## Hexagonal Module Example (smart.tobi.flash)
```
backend/src/main/java/smart/tobi/flash/
  domain/model/Campaign.java
  domain/port/in/JoinFlashSaleUseCase.java
  domain/port/out/StockPort.java
  application/usecase/JoinFlashSaleService.java
  adapter/in/web/FlashController.java
  adapter/out/redis/RedisStockAdapter.java (Lua atomic)
```

## Next Steps (cho Tech Lead)
1.  Confirm US priority (Sprint 1: US-101,201,202,203,204,301,302)
2.  Gen backend skeleton + docker-compose
3.  Implement US-204 (Lua chống oversell) đầu tiên để làm benchmark k6
