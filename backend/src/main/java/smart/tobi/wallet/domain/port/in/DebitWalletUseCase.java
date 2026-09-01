package smart.tobi.wallet.domain.port.in;

import smart.tobi.shared.domain.Money;
import smart.tobi.shared.domain.UserId;

public interface DebitWalletUseCase {
  Result debit(Command cmd);
  record Command(UserId userId, Money amount, Long orderId) {}
  record Result(Long walletId, Money newBalance) {}
  class InsufficientBalanceException extends RuntimeException { public InsufficientBalanceException(String m){ super(m); } }
}
