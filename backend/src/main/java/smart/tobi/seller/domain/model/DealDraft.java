package smart.tobi.seller.domain.model;

import java.time.Instant;
import java.util.Map;

/**
 * M5' Deep-dive: LWW-Map for structured fields (title, price, quantity), Yjs for rich text description
 * Each LWW entry: (value, timestamp, replicaId) - last-write-wins, deterministic on timestamp tie
 * CRDT convergent: 2 clients merge directly also converge, not just server relay
 */
public record DealDraft(Long id, String title, String description, Double price, Map<String, Object> yjsState, Instant updatedAt) {
  public static DealDraft create(String title) { return new DealDraft(null, title, "", 0.0, Map.of(), Instant.now()); }
  public record LWWEntry<T>(T value, Instant timestamp, String replicaId) {}
}
