package smart.tobi.shared.eventbus;

import smart.tobi.shared.domain.DomainEvent;

/**
 * Shared Kernel - EventPublisherPort (interface)
 * InMemory impl for monolith, Kafka impl for microservices - domain doesn't know
 */
public interface EventPublisherPort {
  void publish(DomainEvent event);
}
