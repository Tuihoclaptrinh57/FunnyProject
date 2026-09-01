package smart.tobi.seller.domain.model;

import java.time.Instant;
import java.util.Map;

public record DealDraft(Long id, String title, String description, Double price, Map<String, Object> yjsState, Instant updatedAt) {
  public static DealDraft create(String title) { return new DealDraft(null, title, "", 0.0, Map.of(), Instant.now()); }
}
