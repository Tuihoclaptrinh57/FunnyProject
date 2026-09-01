package smart.tobi.shared.domain;

import java.time.Instant;

/**
 * Shared Kernel - DomainEvent base (no business logic)
 * Used for loose coupling between modules via EventPublisherPort
 */
public interface DomainEvent {
  String topic();
  Instant occurredAt();
}
