package smart.tobi.shared.domain;

import java.time.Instant;

public record ShipmentAssignedEventV1(Long orderId, Long shipperId, String eta, Instant occurredAt) implements DomainEvent {
  @Override public String topic() { return "shipment.assigned"; }
}
