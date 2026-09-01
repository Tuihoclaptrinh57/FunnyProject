package smart.tobi.shared.domain;

import java.time.Instant;

public record FlashSaleJoinedEvent(UserId userId, Long dealId, Instant heldUntil) implements DomainEvent {
  @Override public String topic() { return "flashsale.joined"; }
  @Override public Instant occurredAt() { return heldUntil; }
}
