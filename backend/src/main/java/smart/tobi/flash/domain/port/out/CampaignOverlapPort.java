package smart.tobi.flash.domain.port.out;

import java.time.Instant;

/**
 * US-201: Check overlapping campaign for same product.
 * Hexagonal: domain doesn't know SQL, just port.
 */
public interface CampaignOverlapPort {
  boolean existsOverlapping(Long productId, Instant startAt, Instant endAt);
}
