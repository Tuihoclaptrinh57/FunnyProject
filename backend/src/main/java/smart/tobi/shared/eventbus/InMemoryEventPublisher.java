package smart.tobi.shared.eventbus;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import smart.tobi.shared.domain.DomainEvent;

@Component
public class InMemoryEventPublisher implements EventPublisherPort {
  private final ApplicationEventPublisher springPublisher;
  public InMemoryEventPublisher(ApplicationEventPublisher springPublisher) { this.springPublisher = springPublisher; }
  @Override public void publish(DomainEvent event) { springPublisher.publishEvent(event); }
}
