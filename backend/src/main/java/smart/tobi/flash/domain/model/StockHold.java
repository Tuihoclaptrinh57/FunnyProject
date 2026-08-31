package smart.tobi.flash.domain.model;

import java.time.Instant;

/**
 * US-203: Hold 10 phút - giữ hàng sau khi join, tự nhả nếu không thanh toán
 */
public record StockHold(
    String id,
    Long campaignId,
    Long userId,
    int quantity,
    Instant expiresAt,
    HoldStatus status,
    Instant createdAt
) {
  public enum HoldStatus { ACTIVE, CONFIRMED, EXPIRED, RELEASED }
  public boolean isExpired(Instant now) { return now.isAfter(expiresAt); }
}
