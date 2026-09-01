# ADR-002: API Contract / Event Schema - Versioning & Sync/Async

Date: 2026-09-01

## Event Naming
- Past tense: `CheckoutCompleted`, not `CompleteCheckout`
- Minimal fields: only IDs + data needed for listener to act, not full object - listener queries details if needed

## Event Table (for demo flow)
| Event | Publisher | Subscriber | Fields (V1) |
|---|---|---|---|
| `FlashSaleJoinedEventV1` | M1 Flash | M2 Live (viewer/queue) | `dealId`, `userId`, `queuePosition`, `heldUntil` |
| `CheckoutCompletedEventV1` | M1 Flash | M4 Logistics (create shipment), M3 Feed (history) | `orderId`, `userId`, `dealId`, `amount`, `shippingAddress` |
| `WalletDebitedEventV1` | Wallet | M1 (confirm) | `userId`, `orderId`, `amount`, `newBalance` |
| `ShipmentAssignedEventV1` | M4 | M2/Feed (optional) | `orderId`, `shipperId`, `eta` |
| `DealPinnedEventV1` | M2 | Feed/Recommend | `sessionId`, `dealId`, `pinnedAt` |

## Sync vs Async Rule
- **Sync** (port interface, in-process now / gRPC later) when caller needs immediate result: Flash Sale -> Wallet `debit` before confirming hold
- **Async** (event) when fire-and-forget: Checkout -> Logistics `CheckoutCompletedEvent` (does not affect user response)

## Versioning (for Kafka phase)
- From monolith, put `V1` in name/payload even if not needed yet
- Only add fields (backward compatible), never change type/delete old field - if breaking change, publish `V2` parallel, not replace
