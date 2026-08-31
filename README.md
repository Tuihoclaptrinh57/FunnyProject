# LiveHub SuperApp - Flash Sale + Live Commerce

> Gộp 4 ý tưởng trending vào 1 super-app. Core là Flash Sale + Live. Backend Hexagonal Modular Monolith -> Microservices.

**Stack:** Next.js 15 (PPR, RSC) + Spring Boot 4.0 + Java 25 (Virtual Threads) + PostgreSQL + Redis + Kafka + Qdrant

## Docs
- [01 - PRD](docs/01-PRD.md) - Vision, Modules, FR/NFR
- [02 - User Stories](docs/02-USER-STORIES.md) - 6 Epics, 32 US, AC Gherkin, Backlog
- [03 - Architecture](docs/03-ARCHITECTURE.md) - Hexagonal + Next.js 4 tầng cache + Migration roadmap

## Quick Start (Skeleton)
```bash
# Docs đã sẵn sàng, chưa gen code thì chạy:
docker-compose up -d  # postgres, redis, kafka, qdrant (sẽ tạo ở bước sau)

# Backend skeleton sẽ ở /backend (Spring Boot 4)
# Frontend skeleton sẽ ở /web (Next.js 15)
```

## Hexagonal Module Example
```
backend/src/main/java/com/livehub/modules/flashsale/
  domain/port/in/JoinQueueUseCase.java
  domain/model/QueueTicket.java
  application/usecase/JoinQueueService.java
  adapter/in/web/FlashSaleController.java
  adapter/out/redis/RedisStockAdapter.java
```

## Next Steps (cho Tech Lead)
1.  Confirm US priority (Sprint 1: US-101,201,202,203,204,301,302)
2.  Gen backend skeleton + docker-compose
3.  Implement US-204 (Lua chống oversell) đầu tiên để làm benchmark k6
