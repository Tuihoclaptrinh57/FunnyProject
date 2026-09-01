package smart.tobi.shared.domain;

import java.time.Instant;

public record CheckoutCompletedEvent(Long orderId, UserId userId, Money amount, Instant occurredAt) implements DomainEvent {
  @Override public String topic() { return "checkout.completed"; }
}
