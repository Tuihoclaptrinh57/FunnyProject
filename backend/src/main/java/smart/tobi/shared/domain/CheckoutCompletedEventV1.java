package smart.tobi.shared.domain;

import java.time.Instant;

public record CheckoutCompletedEventV1(Long orderId, UserId userId, Money amount, Instant occurredAt) implements DomainEvent {
  @Override public String topic() { return "checkout.completed"; }
}

