# Shared WS Client

Single WebSocket manager used for Live (M2) + Logistics (M4) + CRDT (M5b)

- `useWs` hook with reconnect, heartbeat
- Topics: `live:{sessionId}`, `tracking:{orderId}`, `crdt:{docId}`
- Will use Redis Pub/Sub on backend, STOMP or raw WS
