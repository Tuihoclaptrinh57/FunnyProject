# User Stories - LiveHub SuperApp
> Format: Epic -> US -> Acceptance Criteria (Gherkin) | Priority: MoSCoW | Story Points (Fibonacci)

## Tổng quan Backlog
- Tổng Epics: 6
- Tổng US: 32
- Ưu tiên P0 (Must): 18 US - làm đầu tiên cho MVP Flash Sale + Live

---

### EPIC 1: Authentication & Social Graph (Foundation)
**Mục tiêu:** Nền tảng user + graph để các module khác dựa vào.

| ID | User Story | Priority | Points | DSA/Tech Note |
|---|---|---|---|---|
| US-101 | Là Buyer, tôi muốn đăng ký/đăng nhập (Email/OAuth) để có tài khoản | Must | 3 | JWT + Refresh, Java 25 Virtual Threads |
| US-102 | Là User, tôi muốn Follow/Unfollow người khác | Must | 5 | Graph Edge, BFS FoF |
| US-103 | Là User, tôi muốn xem gợi ý "People You May Know" (bạn của bạn) | Should | 8 | **DSA: BFS tầng 2 + Mutual Count Heap** |
| US-104 | Là User, tôi muốn xem profile + danh sách follower/following có phân trang | Must | 3 | Cursor Pagination |

**AC US-102:**
```gherkin
Given user A đã follow B
When A follow B lần nữa
Then trả về 409 Conflict
And graph không tạo edge trùng
```

**AC US-103:**
```gherkin
Given A follow B, B follow C,D
When A request suggestions
Then trả về C,D sorted by mutual_count desc
And không trả về B (đã follow) và A
```

---

### EPIC 2: Flash Commerce Engine (CORE - P0)
**Đây là Epic chính, nặng DSA nhất.**

| ID | User Story | Priority | Points | DSA/Tech Note |
|---|---|---|---|---|
| US-201 | Là Seller, tôi muốn tạo Campaign Flash Sale (sản phẩm, stock giới hạn 100, window 19:00-19:15, limit 2/user) | Must | 8 | Interval Scheduling validation |
| US-202 | Là Buyer, tôi muốn tham gia Flash Sale, nếu quá tải thì vào hàng chờ công bằng (queue) | Must | 13 | **DSA: Priority Queue + Token Bucket** |
| US-203 | Là Buyer, tôi muốn giữ hàng 10 phút sau khi bấm "Mua" (hold), hết giờ tự nhả | Must | 8 | Redis TTL + Delayed Queue (Kafka) |
| US-204 | Là System, tôi muốn đảm bảo không bao giờ bán quá stock dù 10k request cùng lúc | Must | 13 | **DSA: Lua Script Atomic + Optimistic Lock, Version** |
| US-205 | Là Buyer, tôi muốn áp voucher + mã live giảm giá stackable | Should | 5 | Strategy Pattern, Heap tính best discount |
| US-206 | Là Buyer, tôi muốn checkout idempotent (bấm 2 lần không tạo 2 đơn) | Must | 5 | Idempotency-Key |

**AC US-202 (Hàng chờ):**
```gherkin
Given stock còn 10, có 1000 request đồng thời
When hệ thống quá tải (threshold 500 RPS)
Then 500 request đầu được xử lý ngay
And 500 còn lại vào WaitingQueue sorted by timestamp FIFO
And client nhận ticketId + vị trí queue + ETA
And poll /queue/{ticketId} trả về position giảm dần
```

**AC US-204 (Chống oversell):**
```gherkin
Given stock = 5 trong Redis
When 100 request trừ stock đồng thời
Then chỉ 5 request thành công
And 95 request nhận lỗi SOLD_OUT
And DB stock = 0, không âm
And k6 test 10k VU không oversell
```

---

### EPIC 3: Live Commerce
| ID | User Story | Priority | Points | DSA/Tech Note |
|---|---|---|---|---|
| US-301 | Là Seller, tôi muốn tạo phòng Live và ghim sản phẩm đang sale lên live | Must | 8 | WebSocket Room |
| US-302 | Là Buyer, tôi muốn chat realtime + thả tim trong live (<150ms) | Must | 8 | Redis Pub/Sub, Sliding Window đếm tim |
| US-303 | Là Buyer, tôi muốn bấm "Mua ghim" ngay trong overlay live không out stream | Must | 5 | Next.js Parallel Routes + Server Actions |
| US-304 | Là User, tôi muốn xem replay live + timeline sản phẩm đã ghim | Could | 3 | Segment Tree timeline |
| US-305 | Là System, tôi muốn lọc chat toxic/spam (Trie) | Should | 5 | **DSA: Trie Filter** |

---

### EPIC 4: Social Feed & Discovery (AI)
| ID | User Story | Priority | Points | DSA/Tech Note |
|---|---|---|---|---|
| US-401 | Là Buyer, tôi muốn lướt Feed For-You vô hạn (infinite scroll, không lag) | Must | 8 | **DSA: Virtualization + Cursor + Top-K Heap Rank** |
| US-402 | Là User, tôi muốn đăng bài (text + ảnh + gắn sản phẩm) | Must | 3 | - |
| US-403 | Là Buyer, tôi muốn search sản phẩm autocomplete (<100ms) | Must | 8 | **DSA: Trie + Inverted Index + Redis cache** |
| US-404 | Là Buyer, tôi muốn search semantic "áo khoác đi mưa nhẹ" ra kết quả dù không chứa từ khóa | Should | 8 | **DSA: Vector ANN (Qdrant)** |
| US-405 | Là Buyer, tôi muốn xem "Sản phẩm tương tự" (recommend) | Should | 5 | Cosine Similarity |
| US-406 | Là System, tôi muốn Fan-out feed khi user đăng bài (cho follower <10k thì push, >10k thì pull) | Should | 8 | Fan-out on Write/Read Hybrid |

**AC US-401:**
```gherkin
Given user có 1000 bài trong feed
When scroll xuống
Then chỉ render 10 items trong viewport (virtualized)
And fetch next cursor khi chạm bottom 80%
And p95 render < 50ms
```

---

### EPIC 5: Logistics & Booking
| ID | User Story | Priority | Points | DSA/Tech Note |
|---|---|---|---|---|
| US-501 | Là Buyer, tôi muốn thấy phí ship tính theo khoảng cách realtime | Must | 5 | **DSA: Haversine + Geohash** |
| US-502 | Là System, tôi muốn tìm shipper gần nhất trong 3km | Should | 8 | **DSA: QuadTree / Redis GEO SEARCH** |
| US-503 | Là Buyer, tôi muốn tracking vị trí shipper realtime trên map | Should | 5 | WebSocket + Geohash update 3s |
| US-504 | Là Buyer, tôi muốn booking slot giao hàng (vd 14:00-16:00) không bị trùng | Should | 5 | **DSA: Interval Tree check overlap** |

---

### EPIC 6: Seller Workspace & Wallet (Collab + Fintech)
| ID | User Story | Priority | Points | DSA/Tech Note |
|---|---|---|---|---|
| US-601 | Là Seller Team, tôi muốn co-edit mô tả sản phẩm realtime như Notion | Should | 13 | **DSA: CRDT (Yjs)** |
| US-602 | Là Seller, tôi muốn xem dashboard đơn hàng realtime (sliding window 1h) | Should | 5 | Sliding Window Counter (Redis) |
| US-603 | Là Buyer, tôi muốn có Ví (nạp, thanh toán, hoàn tiền) với ledger chuẩn | Must | 8 | Double-Entry Ledger, OrderBook Heap |
| US-604 | Là Admin, tôi muốn hoàn tiền hàng loạt khi flash sale lỗi | Could | 5 | Saga Pattern |

---

## 7. Backlog Ưu Tiên (Thứ tự implement)

**Sprint 1 (MVP Flash Sale):** US-101, 102, 201, 202, 203, 204, 206, 301, 302, 303, 603
**Sprint 2 (Feed):** US-401, 402, 403, 404, 103
**Sprint 3 (Logistics):** US-501, 502, 503, 504
**Sprint 4 (Collab & Polish):** US-601, 602, 305, 406

## 8. Definition of Done cho mỗi US
- [ ] Hexagonal: Domain không phụ thuộc Framework
- [ ] Unit test + Integration test (Testcontainers)
- [ ] k6 load test nếu là P0
- [ ] API docs (OpenAPI) + Next.js fetch wrapper typed
- [ ] Không vi phạm 4 tầng cache Next.js
