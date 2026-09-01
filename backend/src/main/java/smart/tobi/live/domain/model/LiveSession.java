package smart.tobi.live.domain.model;

import java.time.Instant;

public record LiveSession(Long id, String title, Long sellerId, String status, Instant startedAt, Instant endedAt) {
  public static LiveSession start(String title, Long sellerId) {
    return new LiveSession(null, title, sellerId, "LIVE", Instant.now(), null);
  }
  public LiveSession end() {
    return new LiveSession(id, title, sellerId, "ENDED", startedAt, Instant.now());
  }
}
