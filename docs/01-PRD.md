# PRD - SmartTobi SuperApp (smart.tobi) - Flash Sale + Live Commerce Core
> Version: 1.1 | Date: 2026-09-01 | Author: Senior Tech Lead
> Stack: Next.js 15 (App Router, PPR) + Spring Boot 4.0 / Java 25 (Virtual Threads) + PostgreSQL + Redis + Kafka + Qdrant
> Branding: smart.tobi | Packages: smart.tobi.* | Domains: live.smart.tobi, flash.smart.tobi, feed.smart.tobi, api.smart.tobi

## 1. Vision & Positioning
**One-liner:** Shopee Flash Sale + TikTok Live + Threads Feed + Grab Logistics + Notion Seller Workspace trong 1 app.

**Mục tiêu Tech:** Showcase tối đa DSA + Architect cho Senior Lead. Không phải CRUD:
- Chịu tải 10k-50k RPS flash sale
- Feed ranking realtime, Graph recommendation
- Geo tracking realtime, Collaborative editing

**Target User:**
1.  Buyer (end-user) - săn deal, xem live, lướt feed
2.  Seller/Streamer - tạo shop, live bán hàng, cộng tác
3.  Admin/Ops - quản lý chiến dịch

## 2. Gộp 4 Modules vào 1 Product

| Module Gốc | Tên Module trong SmartTobi | Package | Vai trò | DSA / Algo Chính |
| :--- | :--- | :--- | :--- | :--- |
| #1 Flash Sale Commerce | **M1: Flash Commerce Engine** (CORE) | `smart.tobi.flash` | Sản phẩm, giỏ hàng, tồn kho, flash sale, order | Heap (Queue chờ), Token Bucket (Rate Limit), Optimistic Lock + Lua Script, Consistent Hashing |
| #1 Live | **M2: Live Commerce** | `smart.tobi.live` | Live stream (WebRTC/WS), Chat, Like, Ghim sản phẩm | Sliding Window (thống kê view), Trie (filter chat) |
| #2 Social Feed | **M3: Social & Discovery** | `smart.tobi.feed` | Post, Follow, Like, Feed, Search, AI Recommend | Graph BFS/DFS, Top-K Heap (Feed Rank), Inverted Index, Vector Search (ANN) |
| #4 Logistics | **M4: Logistics & Booking** | `smart.tobi.logistics` | Địa chỉ, phí ship, booking slot, tracking shipper | Geohash/QuadTree, Dijkstra/A* (ETA), Interval Scheduling |
| #3 Collaborative + #5 Fintech | **M5: Seller Workspace & Wallet** | `smart.tobi.wallet` + `smart.tobi.collab` | Co-edit mô tả sản phẩm, quản lý đơn, ví, ledger | CRDT (Yjs), OrderBook Heap, Double-Entry Ledger |
| Foundation | **M0: User & Catalog & Common** | `smart.tobi.user` `smart.tobi.catalog` `smart.tobi.common` | Auth, User Graph, Product catalog, Shared Kernel | Graph, Inverted Index |

## 3. Functional Requirements (High Level)

### M1 - Flash Commerce (P0 - CORE)
- FR1.1: Seller tạo chiến dịch Flash Sale (số lượng giới hạn, time window, max per user)
- FR1.2: Buyer tham gia hàng chờ (queue) khi quá tải - fair queue
- FR1.3: Giữ hàng (hold) 10 phút sau khi đặt, tự nhả nếu không thanh toán
- FR1.4: Chống oversell: tồn kho không âm dù 50k concurrent
- FR1.5: Voucher stackable + tính giá động

### M2 - Live Commerce
- FR2.1: Seller tạo phòng Live, stream (tích hợp LiveKit/Agora hoặc mock HLS)
- FR2.2: Buyer chat realtime, thả tim, ghim sản phẩm lên live
- FR2.3: Mua ngay trong live không rời stream (overlay checkout)
- FR2.4: Replay + highlight sản phẩm đã ghim

### M3 - Social & Discovery
- FR3.1: Social Graph: Follow, Block, đề xuất bạn bè (FoF)
- FR3.2: Feed For-You: Rank theo (tương tác + freshness + affinity) - Fan-out
- FR3.3: Search: Autocomplete, full-text + vector semantic search
- FR3.4: AI Recommend: "Sản phẩm tương tự" bằng embedding

### M4 - Logistics
- FR4.1: Tính phí ship theo khoảng cách (Haversine + Geohash)
- FR4.2: Tìm shipper gần nhất (Redis GEO)
- FR4.3: Tracking realtime vị trí shipper (WebSocket)
- FR4.4: Booking slot giao hàng (không overlap)

### M5 - Workspace & Wallet
- FR5.1: Nhiều seller co-edit trang sản phẩm (CRDT)
- FR5.2: Ví điện tử: nạp, trừ, hoàn, lịch sử ledger
- FR5.3: Dashboard analytics realtime (sliding window)

## 4. Non-Functional Requirements
- NFR1 Performance: p95 < 300ms (thường), < 800ms (flash sale queue)
- NFR2 Scale: 10k RPS write, 50k RPS read
- NFR3 Consistency: Strong consistency cho inventory/payment, Eventual cho feed
- NFR4 Availability: 99.9% (cho phép degrade feed khi flash sale)
- NFR5 Security: JWT + Refresh, RBAC, Rate Limit per IP/User

## 5. KPIs Thành Công (để demo)
- 0 oversell trong test k6 10k VU
- Feed load < 1.5s với PPR + virtualization
- Live chat < 150ms latency

## 6. Roadmap Phased
- **Phase 1 (MVP - 4 tuần):** M1 + M2 cơ bản + Auth + Monolith Hexagonal
- **Phase 2:** M3 (Feed + Search) + M4 (Shipping mock)
- **Phase 3:** M5 (CRDT + Wallet) + AI Recommend
- **Phase 4:** Migration Microservices + K8s + Observability
