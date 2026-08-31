package smart.tobi.flash.domain.model;

import java.time.Instant;

/**
 * Domain Aggregate - Pure Java, no Spring dependency.
 * DSA: Interval check for time window.
 */
public record Campaign(
    Long id,
    Long productId,
    int stockTotal,
    int stockRemaining,
    Instant startAt,
    Instant endAt,
    int maxPerUser,
    CampaignStatus status,
    long version) {

  public boolean isActive(Instant now) {
    return status == CampaignStatus.ACTIVE
        && !now.isBefore(startAt)
        && now.isBefore(endAt)
        && stockRemaining > 0;
  }

  public boolean isOverlapping(Campaign other) {
    return this.productId.equals(other.productId)
        && this.startAt.isBefore(other.endAt)
        && other.startAt.isBefore(this.endAt);
  }

  public enum CampaignStatus { DRAFT, ACTIVE, ENDED, CANCELLED }
}
