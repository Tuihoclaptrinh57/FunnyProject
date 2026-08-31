package smart.tobi.flash.adapter.in.web.dto;

import jakarta.validation.constraints.*;
import java.time.Instant;

public record CreateCampaignRequest(
    @NotNull Long productId,
    @Min(1) @Max(100000) int stockTotal,
    @NotNull Instant startAt,
    @NotNull Instant endAt,
    @Min(1) int maxPerUser
) {}
