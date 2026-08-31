package smart.tobi.flash.adapter.in.web;

import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart.tobi.flash.domain.port.in.JoinFlashSaleUseCase;

/**
 * Adapter In - Web. Chỉ mapping HTTP -> Command, không chứa business.
 */
@RestController
@RequestMapping("/api/flash")
public class FlashController {

  private final JoinFlashSaleUseCase joinUseCase;

  public FlashController(JoinFlashSaleUseCase joinUseCase) {
    this.joinUseCase = joinUseCase;
  }

  @PostMapping("/{campaignId}/join")
  public ResponseEntity<JoinFlashSaleUseCase.Result> join(
      @PathVariable Long campaignId,
      @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
      @RequestParam @Min(1) int quantity,
      @RequestAttribute("userId") Long userId) { // resolved via JWT filter

    var cmd = new JoinFlashSaleUseCase.Command(campaignId, userId, quantity, idempotencyKey);
    var result = joinUseCase.join(cmd);
    return switch (result.status()) {
      case "HOLD_CREATED" -> ResponseEntity.ok(result);
      case "QUEUED" -> ResponseEntity.accepted().body(result);
      case "SOLD_OUT" -> ResponseEntity.status(409).body(result);
      default -> ResponseEntity.badRequest().body(result);
    };
  }

  @GetMapping("/{campaignId}/stock")
  public ResponseEntity<Long> stock(@PathVariable Long campaignId) {
    // delegated to StockPort via query use case - simplified
    return ResponseEntity.ok(0L);
  }
}
