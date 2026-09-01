# Architecture - SmartTobi SuperApp (smart.tobi)
> Hexagonal Modular Monolith -> Microservices | Next.js 15 + Spring Boot 4 + Java 25
> Packages: smart.tobi.* | Domains: *.smart.tobi

## 1. Tổng Quan Kiến Trúc

### 1.1 High-Level Diagram
```
                    [ Next.js 15 Frontend - Vercel/Node ]
                    - App Router + PPR + RSC
                    - Server Actions (BFF)
                    - TanStack Query + Zustand + Virtualization
                              |
                              | HTTPS / WSS
                              v
                    [ Spring Boot 4 Modular Monolith :8080 ]
                    - Java 25 Virtual Threads (Tomcat vThreads)
                    - Modules: User, Catalog, FlashSale, Live, Feed, Logistics, Wallet
                    - Hexagonal per Module
                              |
            +-----------------+-----------------+
            |                 |                 |
        [PostgreSQL]      [Redis Cluster]   [Kafka]  [Qdrant Vector]
        (Primary DB)      (Cache/Queue/GEO) (Event)  (AI Search)
            |
        [LiveKit/Agora] (Live Stream - phase 2)
```

**Tại sao Modular Monolith trước?**
- Senior Lead cần chứng minh DDD + Hexagonal trước khi chẻ microservice (tránh distributed monolith)
- Dễ transaction, dễ test, deploy 1 artifact, nhưng code đã sẵn sàng tách service (module boundary rõ).

## 2. Backend: Hexagonal Architecture (Ports & Adapters) - Maven single-module, package boundaries

### 2.1 Structure cho MỖI Module (vd: smart.tobi.flash = module-flashsale M1)
```
backend/src/main/java/smart/tobi/
 ├─ shared/                  // Shared Kernel - KHÔNG business logic
 │   ├─ domain/              // UserId, Money, DomainEvent
 │   ├─ eventbus/            // EventPublisherPort + InMemoryEventPublisher (monolith) / KafkaEventPublisher (microservice)
 │   └─ web/                 // ApiResponse, GlobalExceptionHandler
 ├─ flash/                   // module-flashsale M1 CORE
 │   ├─ domain/              // FlashSaleItem, StockPolicy, QueueTicket (pure java)
 │   ├─ application/         // JoinQueueUseCase, HoldStockUseCase + port/in + port/out (StockRepositoryPort, EventPublisherPort, WalletClientPort)
 │   ├─ adapter-in-web/      // REST + WebSocket controller
 │   ├─ adapter-out-persistence/ // Redis ZSET Heap, Lua, Postgres
 │   └─ adapter-out-client/  // WalletClientPort in-process now, Feign later
 ├─ live/                    // module-live M2
 ├─ feed/                    // module-social-feed M3
 ├─ logistics/               // module-logistics M4
 ├─ wallet/                  // module-wallet-payment
 ├─ collab/                  // module-seller-workspace M5 CRDT
 └─ SmartTobiApplication.java // app-bootstrap - chỉ wiring

// Nguyên tắc: domain/application không import module khác - chỉ via shared-kernel + port interface
```

**Quy tắc vàng Hexagonal:**
1.  `domain` không import `org.springframework.*`
2.  Controller chỉ mapping HTTP <-> DTO, không chứa logic
3.  Mọi I/O (DB, Redis, Kafka) qua `port/out` interface -> dễ mock test + dễ migrate DB
4.  Module giao tiếp nhau qua `port/in` (in-process call), KHÔNG gọi trực tiếp adapter. Khi tách microservice chỉ cần thay adapter `in-process` bằng `Feign/Kafka`.

### 2.2 Các Modules & Bounded Context (smart.tobi.* = module-*)
```
[smart.tobi.shared]     -> Shared Kernel: UserId, Money, DomainEvent, EventPublisherPort, ApiResponse (KHÔNG business logic)
[smart.tobi.user]       -> User, Auth
[smart.tobi.catalog]    -> Product, Category
[smart.tobi.flash]      -> module-flashsale M1 CORE - Campaign, StockHold, QueueTicket
[smart.tobi.live]       -> module-live M2 - LiveSession, PinnedDeal
[smart.tobi.feed]       -> module-social-feed M3 - Post, FeedEntry, Top-K, Vector
[smart.tobi.logistics]  -> module-logistics M4 - Shipment, ShipperLocation, GEO
[smart.tobi.wallet]     -> module-wallet-payment - Wallet, Ledger
[smart.tobi.collab]     -> module-seller-workspace M5 - DealDraft, CRDT
```

### 2.2.1 Cầu nối giữa modules (EventPublisherPort)
```java
// shared/eventbus/EventPublisherPort.java
public interface EventPublisherPort { void publish(DomainEvent event); }
// Monolith: InMemoryEventPublisher (ApplicationEventPublisher)
// Microservice: KafkaEventPublisher (kafkaTemplate.send)
// Events: FlashSaleJoinedEvent, CheckoutCompletedEvent, WalletDebitedEvent
// Logistics chỉ subscribe CheckoutCompletedEvent - loose coupling qua event
```

Dependency rule: `FlashSale -> Catalog` via `CatalogPort` (interface), không via JPA trực tiếp.

### 2.3 Data Model Chính (PostgreSQL)
```sql
-- M1
campaign(id, product_id, stock_total, stock_remaining, start_at, end_at, max_per_user, status)
stock_hold(id, campaign_id, user_id, quantity, expires_at, status) -- TTL 10p
queue_ticket(id, campaign_id, user_id, position, status, created_at)
orders(id, user_id, campaign_id, quantity, amount, idempotency_key UNIQUE, status)

-- M3 Graph
follows(follower_id, following_id, created_at) PK(follower,following)
posts(id, author_id, content, product_ids, created_at)

-- M4
shipper_location(shipper_id, geohash, lat, lng, updated_at) -- sync Redis GEO

-- M5 Wallet
wallet(id, user_id, balance)
ledger(id, wallet_id, amount, type, ref_id, created_at) -- double entry
```

**Redis Key Design:**
```
flash:stock:{campaignId} -> int (atomic decr via Lua)
flash:queue:{campaignId} -> SortedSet (score=timestamp)
hold:{holdId} -> hash (TTL 600s)
live:room:{roomId}:chat -> Stream
feed:{userId} -> ZSet (fan-out cache)
geo:shipper -> GEOADD
```

### 2.4 DSA Showcase (theo proposal)
| Module | Kỹ thuật | Vị trí code |
|---|---|---|
| M1 Flash Sale | Queue + Heap (Redis ZSET priority queue) | `adapter-out-persistence` Redis ZSET |
| M1 Flash Sale | Lua script atomic decrement stock | `StockLuaExecutor` adapter-out-persistence |
| M2 Live | WebSocket fan-out | Redis Pub/Sub + STOMP, viewer subscribe `live:{sessionId}` |
| M3 Feed | Top-K ranking | `RankFeedUseCase` heap top-K / Redis sorted set |
| M3 Feed | Vector search recommend | `pgvector` / Qdrant client `adapter-out-search` |
| M4 Logistics | GEO search shipper gần nhất | `Redis GEOSEARCH` / PostGIS `ST_DWithin` |
| M5 Seller | CRDT co-edit | Yjs frontend + Hocuspocus / Automerge adapter-in-websocket |
| Chung | Virtual Threads (JDK 25) | `spring.threads.virtual.enabled=true` cho I/O-bound adapters |

## 3. Frontend: Next.js 15 Architecture - Feature-first (mirrors backend modules)

### 3.1 App Router + Features Structure
```
app/
 ├─ (feed)/                # M3
 ├─ (live)/[sessionId]/    # M2
 ├─ (flashsale)/[dealId]/  # M1
 ├─ (wallet)/              # ví
 ├─ (tracking)/[orderId]/  # M4
 └─ (seller)/workspace/    # M5
features/
 ├─ flash-sale/  {api/, components/, store/}  # Queue/Hold countdown Zustand
 ├─ live/        {ws/}                          # WebSocket fan-out client
 ├─ feed/        # Top-K, VirtualizedFeed
 ├─ wallet/
 ├─ logistics/   # GEO tracking
 └─ seller-workspace/crdt/ # Yjs provider
shared/
 ├─ ui/          # design system
 └─ ws-client/   # 1 WebSocket manager cho Live + Logistics + CRDT
```

### 3.2 4 Tầng Cache Strategy
| Tầng | Dùng cho | Code |
|---|---|---|
| Request Memoization | Dedup fetch trong 1 render | `fetch()` tự động |
| Data Cache | Product, Campaign | `fetch(url, {next:{tags:['campaign']}})` + `revalidateTag` khi update |
| Full Route Cache | Feed shell, Product list | `export const revalidate = 60` |
| Router Cache | Back/forward | `router.prefetch` |

**PPR cho Feed:**
```tsx
// app/feed/page.tsx
<Suspense fallback={<FeedSkeleton />}>
  <FeedList /> {/* dynamic, fetch feed */}
</Suspense>
```

### 3.3 Realtime
- Live Chat: `WebSocket` (STOMP over WebSocket via Spring `spring-websocket` + Redis Pub/Sub)
- Queue Position: Polling 2s + `Server-Sent Events` (SSE) phase 2
- Shipper: WebSocket

## 4. Roadmap Migration: Modular Monolith -> Microservices (theo proposal)

### Phase 1 (hiện tại): 1 Spring Boot app, Gradle/Maven module = package boundary, DB schema riêng/module trong 1 Postgres (để tách DB sau không đau), EventPublisherPort = InMemory
### Phase 2: Đo tải, module cần scale riêng (Flash Sale + Live) tách trước
### Phase 3: Đổi EventPublisherPort impl từ InMemory sang Kafka, đổi WalletClientPort từ Java interface call sang REST/gRPC client, thêm API Gateway
> Vì domain/application không đổi, effort tách chỉ nằm ở adapter layer - "hexagonal giúp migration rẻ"

**Tiêu chí tách:** RPS >5k hoặc team >5 dev/module
**Infra:** Docker + k8s Helm, HPA, OpenTelemetry, Prometheus, Grafana, GitHub Actions

## 5. ADR (Architecture Decision Records)

**ADR-001: Chọn Modular Monolith thay vì Microservices ngay**
- Context: Team nhỏ, cần speed + transaction
- Decision: Monolith hexagonal
- Consequence: Dễ refactor, nhưng phải kỷ luật boundary

**ADR-002: Java 25 Virtual Threads thay vì WebFlux**
- Context: Cần high concurrency flash sale
- Decision: Virtual Threads (Spring Boot 4 auto-enable `spring.threads.virtual.enabled=true`)
- Consequence: Code imperative dễ đọc hơn reactive, scale tương đương

**ADR-003: Redis Lua cho stock**
- Context: Chống oversell
- Decision: Lua script atomic decr + check >0
- Consequence: Strong consistency, không cần distributed lock nặng

**ADR-004: Keep Maven (theo yêu cầu)**
- Context: Proposal đề xuất Gradle multi-module, team yêu cầu giữ Maven
- Decision: Giữ `backend/pom.xml` single-module, `smart.tobi.*` packages làm module boundaries, `shared-kernel` là packages, frontend `features/*`
- Consequence: Không migration Gradle, CI `mvn` giữ nguyên, boundaries vẫn rõ - xem `docs/adr/001-keep-maven.md`

---

## 6. Lệnh Khởi Tạo (đã chốt package smart.tobi)
```bash
# Backend
spring init --groupId=smart.tobi --artifactId=smart-tobi --packageName=smart.tobi --java-version=25 --boot-version=4.0.0 --dependencies=web,data-jpa,postgresql,redis,websocket,validation,kafka smart-tobi

# Frontend (Turborepo + Next.js)
npx create-next-app@latest apps/web --typescript --app --tailwind --eslint
# Domains: live.smart.tobi, flash.smart.tobi, feed.smart.tobi -> proxied via api.smart.tobi
```

Chi tiết file `docs/adr/*` sẽ ghi thêm khi implement.
