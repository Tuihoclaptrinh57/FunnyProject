package smart.tobi.flash.adapter.in.web;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart.tobi.flash.adapter.in.web.dto.CreateCampaignRequest;
import smart.tobi.flash.adapter.in.web.dto.CreateCampaignResponse;
import smart.tobi.flash.domain.port.in.CreateCampaignUseCase;

/**
 * US-201 Adapter In - Web. Only maps HTTP <-> Command, no business.
 * Route: POST /api/flash/campaigns -> smart.tobi.flash
 */
@RestController
@RequestMapping("/api/flash/campaigns")
public class CampaignController {

  private final CreateCampaignUseCase createUseCase;

  public CampaignController(CreateCampaignUseCase createUseCase) {
    this.createUseCase = createUseCase;
  }

  @PostMapping
  public ResponseEntity<CreateCampaignResponse> create(
      @Valid @RequestBody CreateCampaignRequest req,
      @RequestAttribute(value = "sellerId", required = false) Long sellerId) {

    // TODO: resolve sellerId from JWT - mock 1L for now
    Long effectiveSellerId = sellerId != null ? sellerId : 1L;

    var cmd = new CreateCampaignUseCase.Command(
        req.productId(), req.stockTotal(), req.startAt(), req.endAt(), req.maxPerUser(), effectiveSellerId);

    var campaign = createUseCase.create(cmd);
    return ResponseEntity.status(HttpStatus.CREATED).body(CreateCampaignResponse.from(campaign));
  }
}
