package smart.tobi.wallet.domain.model;

import smart.tobi.shared.domain.Money;
import smart.tobi.shared.domain.UserId;
import java.time.Instant;

public record Ledger(Long id, Long walletId, UserId userId, Money amount, String type, Long refId, Instant createdAt) {
  public static Ledger debit(Long walletId, UserId userId, Money amount, Long orderId) {
    return new Ledger(null, walletId, userId, amount, "DEBIT", orderId, Instant.now());
  }
  public static Ledger credit(Long walletId, UserId userId, Money amount, Long refId) {
    return new Ledger(null, walletId, userId, amount, "CREDIT", refId, Instant.now());
  }
}
