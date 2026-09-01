package smart.tobi.shared.domain;

import java.time.Instant;

public record DealPinnedEventV1(Long sessionId, Long dealId, Instant pinnedAt) implements DomainEvent {
  @Override public String topic() { return "deal.pinned"; }
  @Override public Instant occurredAt() { return pinnedAt; }
}
