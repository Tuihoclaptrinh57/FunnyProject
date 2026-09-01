package smart.tobi.logistics.domain.model;

import java.time.Instant;

public record Shipment(Long id, Long orderId, Long shipperId, String status, Instant createdAt) {
  public static Shipment create(Long orderId) { return new Shipment(null, orderId, null, "CREATED", Instant.now()); }
}
