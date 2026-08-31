package smart.tobi.flash.adapter.in.web.dto;

import smart.tobi.flash.domain.model.Campaign;
import java.time.Instant;

public record CreateCampaignResponse(
    Long id,
    Long productId,
    int stockTotal,
    int stockRemaining,
    Instant startAt,
    Instant endAt,
    int maxPerUser,
    String status
) {
  public static CreateCampaignResponse from(Campaign c) {
    return new CreateCampaignResponse(
        c.id(), c.productId(), c.stockTotal(), c.stockRemaining(),
        c.startAt(), c.endAt(), c.maxPerUser(), c.status().name());
  }
}
