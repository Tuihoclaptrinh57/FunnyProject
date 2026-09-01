package smart.tobi.feed.domain.model;

import java.time.Instant;

public record Post(Long id, Long authorId, String content, Long dealId, Instant createdAt) {}
