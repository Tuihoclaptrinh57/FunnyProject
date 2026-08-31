# Overview - Làm sao gộp 4 ý tưởng mà không thành nồi lẩu?

## Nguyên tắc gộp (của Senior Lead)
Không gộp UI, gộp **Bounded Context** và chia sẻ **User + Event**.

```
Flash Sale (CORE) <--- Live (tăng conversion 300%)
      ^                    |
      |                    v
  Wallet/Payment <--- Social Feed (giữ chân user, AI recommend sản phẩm flash sale)
      ^
      |
  Logistics (ship sau khi order flash sale)
      +
  Seller Workspace (CRDT để team seller cùng soạn deal)
```

**User Journey chính (để demo):**
1. Buyer lướt **Feed** (M3) thấy post gắn deal Flash Sale
2. Bấm vào xem **Live** (M2) đang ghim deal đó
3. Bấm **Tham gia Flash Sale** -> vào **Queue** (M1) -> Hold 10p -> Checkout -> **Ví** (M5) trừ tiền
4. Tracking **Shipper** realtime (M4)
5. Seller dùng **Workspace** (M5) co-edit deal tiếp theo

=> 1 flow duy nhất đi qua cả 4 modules, không bị rời rạc.

## DSA Showcase trong 1 flow
- **Queue Heap** (M1) + **Lua Stock** (M1)
- **WebSocket Fan-out** (M2)
- **Top-K Feed Rank** (M3) + **Vector Search** (M3)
- **GEO Search** (M4)
- **CRDT** (M5)

Đủ để bạn nói 2 tiếng phỏng vấn System Design không hết chuyện.
