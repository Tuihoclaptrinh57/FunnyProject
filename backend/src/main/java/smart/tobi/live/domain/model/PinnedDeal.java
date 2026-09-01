package smart.tobi.live.domain.model;

import java.time.Instant;

public record PinnedDeal(Long id, Long sessionId, Long dealId, Instant pinnedAt) {}
