package smart.tobi.shared.eventbus;

import smart.tobi.shared.domain.DomainEvent;

/**
 * Microservices impl - swap InMemoryEventPublisher with this when migrating
 * Requires: kafkaTemplate.send(event.topic(), event)
 */
// @Component @ConditionalOnProperty(name="eventbus", havingValue="kafka")
public class KafkaEventPublisher implements EventPublisherPort {
  // private final KafkaTemplate<String, Object> kafkaTemplate;
  // public KafkaEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) { this.kafkaTemplate = kafkaTemplate; }
  @Override public void publish(DomainEvent event) {
    // kafkaTemplate.send(event.topic(), event);
    throw new UnsupportedOperationException("Enable kafka profile to use KafkaEventPublisher");
  }
}
