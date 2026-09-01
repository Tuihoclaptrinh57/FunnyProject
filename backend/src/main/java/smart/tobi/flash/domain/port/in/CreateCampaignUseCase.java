package smart.tobi.flash.domain.port.in;

import smart.tobi.flash.domain.model.Campaign;
import java.time.Instant;

/**
 * US-201: Input Port - Create Campaign
 */
public interface CreateCampaignUseCase {

  Campaign create(Command cmd);

  record Command(
      Long productId,
      int stockTotal,
      Instant startAt,
      Instant endAt,
      int maxPerUser,
      Long sellerId) {}

  // Domain exceptions
  class OverlappingCampaignException extends RuntimeException {
    public OverlappingCampaignException(String msg) { super(msg); }
  }
  class InvalidTimeWindowException extends RuntimeException {
    public InvalidTimeWindowException(String msg) { super(msg); }
  }
}
