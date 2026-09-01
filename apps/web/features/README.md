# Features - Bounded Context per Module (mirrors backend smart.tobi.*)

Each feature folder corresponds to a backend module (hexagonal):

- `flash-sale/` <-> `smart.tobi.flash` (M1) - Queue/Hold countdown store (ZSet + Lua TTL)
- `live/` <-> `smart.tobi.live` (M2) - WebSocket fan-out, viewer count
- `feed/` <-> `smart.tobi.feed` (M3) - Top-K heap, vector search
- `wallet/` <-> `smart.tobi.wallet` (M5a) - 3 balances, 3-step transaction
- `logistics/` <-> `smart.tobi.logistics` (M4) - GEO search, ETA
- `seller-workspace/crdt/` <-> `smart.tobi.collab` (M5b) - Yjs provider, CRDT binding

Structure per feature:
```
features/flash-sale/
├── api/        # react-query hooks -> /api/v1/flashsale
├── components/ # Queue, Countdown, Stock bar
└── store/      # Zustand for hold countdown (XUYÊN SUỐT)
```
