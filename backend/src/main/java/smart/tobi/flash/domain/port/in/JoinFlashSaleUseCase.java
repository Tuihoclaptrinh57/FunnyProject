package smart.tobi.flash.domain.port.in;

/**
 * Input Port (UseCase) - Hexagonal
 * Called by adapter/in/web
 */
public interface JoinFlashSaleUseCase {

  Result join(Command command);

  record Command(Long campaignId, Long userId, int quantity, String idempotencyKey) {}

  record Result(String status, String holdId, String ticketId, Integer position) {
    // status: HOLD_CREATED | QUEUED | SOLD_OUT | LIMIT_EXCEEDED
  }
}
