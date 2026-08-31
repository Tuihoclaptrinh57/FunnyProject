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

## 2. Backend: Hexagonal Architecture (Ports & Adapters)

### 2.1 Structure cho MỖI Module (vd: smart.tobi.flash)
```
smart.tobi.flash            // = package smart.tobi.flash (hexagonal)
 ├─ domain                  // Pure Java, 0 dependency Spring
 │   ├─ model/              // Aggregate: Campaign, Stock, Hold, QueueTicket
 │   ├─ service/            // Domain Service (business rule)
 │   └─ port/in             // Input Port: JoinFlashSaleUseCase, CreateCampaignUseCase
 │   └─ port/out            // Output Port: StockPort, QueuePort, CampaignRepositoryPort
 ├─ application             // UseCase implementation, DTO, Mapper, Tx
 │   └─ usecase/            // JoinFlashSaleService implements JoinFlashSaleUseCase
 ├─ adapter                 // Framework dependent
 │   ├─ in/web/             // FlashController (chỉ gọi UseCase)
 │   ├─ in/kafka/           // FlashEventListener
 │   ├─ out/persistence/    // JpaCampaignAdapter implements CampaignRepositoryPort
 │   └─ out/redis/          // RedisStockAdapter implements StockPort
 └─ config/

// Tương tự cho các modules:
smart.tobi.live, smart.tobi.feed, smart.tobi.logistics, smart.tobi.wallet, smart.tobi.user, smart.tobi.catalog, smart.tobi.common
```

**Quy tắc vàng Hexagonal:**
1.  `domain` không import `org.springframework.*`
2.  Controller chỉ mapping HTTP <-> DTO, không chứa logic
3.  Mọi I/O (DB, Redis, Kafka) qua `port/out` interface -> dễ mock test + dễ migrate DB
4.  Module giao tiếp nhau qua `port/in` (in-process call), KHÔNG gọi trực tiếp adapter. Khi tách microservice chỉ cần thay adapter `in-process` bằng `Feign/Kafka`.

### 2.2 Các Modules & Bounded Context (smart.tobi.*)
```
[smart.tobi.user]       -> User, Follow Graph, Auth
[smart.tobi.catalog]    -> Product, Category, Inventory
[smart.tobi.flash]      -> Campaign, StockHold, QueueTicket - DEPEND catalog, user
[smart.tobi.live]       -> LiveRoom, ChatMessage, PinnedProduct - DEPEND flash
[smart.tobi.feed]       -> Post, FeedItem, Search - DEPEND user, catalog
[smart.tobi.logistics]  -> Shipment, ShipperLocation, Slot
[smart.tobi.wallet]     -> Wallet, Ledger, Transaction
[smart.tobi.common]     -> Shared Kernel: Error, Auditing, Idempotency
[smart.tobi.collab]     -> Co-edit CRDT Document
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

### 2.4 DSA Mapping trong Backend (Java 25)
| Feature | DSA/Algo | Implement Java |
|---|---|---|
| Chống oversell | Lua atomic + Optimistic Lock | `RedisScript<Long>` + `@Version` |
| Queue công bằng | Priority Queue (timestamp) | `Redis ZADD` + `ZPOPMIN` |
| Rate Limit | Token Bucket | `Bucket4j + Redis` |
| Gợi ý bạn bè | BFS 2 tầng | `JGraphT` hoặc recursive CTE SQL |
| Feed Rank | Top-K Heap | `PriorityQueue<FeedScore>` |
| Ship gần nhất | Geohash/QuadTree | `Redis GEOSEARCH` |
| CRDT | Yjs port | `y-websocket` adapter (Node), Java sync |

## 3. Frontend: Next.js 15 Architecture

### 3.1 App Router Structure
```
app/
 ├─ (public)/(auth)/login/page.tsx      // RSC + Server Actions
 ├─ (app)/feed/page.tsx                 // PPR: shell tĩnh + feed dynamic stream
 ├─ (app)/live/[roomId]/page.tsx        // Client Component (WebSocket)
 ├─ (app)/flash/[campaignId]/page.tsx   // ISR 5s + Streaming queue position
 └─ api/                                // Route Handler proxy (nếu cần)
components/
 ├─ ui/ (shadcn)
 ├─ feed/VirtualizedFeed.tsx            // tanstack-virtual
 └─ live/ChatWindow.tsx
lib/
 ├─ api/ (typed fetch wrapper + revalidateTag)
 └─ store/ (zustand)
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

## 4. Roadmap Migration: Modular Monolith -> Microservices

### Phase 1: Monolith (Hiện tại - 1 deployable)
```
Single JAR: smart-tobi-monolith.jar (groupId: smart.tobi)
Modules giao tiếp in-process via UseCase interfaces (smart.tobi.flash.port.in -> smart.tobi.catalog.port.in)
DB: 1 PostgreSQL, schema chia theo module (user_*, catalog_*, flash_*, live_*, feed_*)
Kafka: single broker, topic prefix smart.tobi.*
Domain: api.smart.tobi
```

### Phase 2: Tách DB + Async (Chuẩn bị)
- Tách schema thành separate schemas, dùng `port/out` đã abstract nên không đổi domain
- Chuyển in-process call thành `ApplicationEvent` + Kafka: vd `OrderCreatedEvent` -> Feed, Wallet
- Introduce `Saga` cho Order -> Hold -> Payment

### Phase 3: Physical Split (Khi cần scale)
```
[Gateway] -> [User Service] [Catalog Service] [FlashSale Service] [Live Service] [Feed Service]
Mỗi service: 1 JAR + 1 DB + 1 Redis namespace
Giao tiếp: OpenFeign (sync) + Kafka (async)
Tách bằng cách: copy module folder thành repo mới, thay adapter in-process = Feign client implement port/out
```

**Tiêu chí tách:** Khi FlashSale RPS > 5k liên tục hoặc team > 5 dev/module.

### Phase 4: Infra
- Docker + k8s (Helm), HPA theo CPU/RPS
- Observability: OpenTelemetry + Prometheus + Grafana + Loki
- CI/CD: GitHub Actions (build Next.js + Spring Boot native image GraalVM)

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
