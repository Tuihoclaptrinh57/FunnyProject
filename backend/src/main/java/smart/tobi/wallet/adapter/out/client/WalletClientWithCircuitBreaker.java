package smart.tobi.wallet.adapter.out.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.stereotype.Component;
import smart.tobi.shared.domain.Money;
import smart.tobi.shared.domain.UserId;
import smart.tobi.wallet.domain.port.in.DebitWalletUseCase;

/**
 * 3. Circuit breaker / timeout for sync Wallet call from Flash Sale
 * Flash Sale -> Wallet is sync (needs immediate result for hold confirm), must not hang
 * Timeout 300ms, circuit open if 50% failures in 10s, next requests fail fast, retry after 5s
 * Placed in adapter-out-client, not domain - domain only sees success/failure
 */
@Component
public class WalletClientWithCircuitBreaker {
  private final DebitWalletUseCase debitUseCase;
  public WalletClientWithCircuitBreaker(DebitWalletUseCase debitUseCase){this.debitUseCase=debitUseCase;}

  @CircuitBreaker(name = "wallet", fallbackMethod = "fallback")
  public DebitWalletUseCase.Result debitWithBreaker(UserId userId, Money amount, Long orderId){
    // timeout via Resilience4j TimeLimiter (configured in application.yml: 300ms)
    return debitUseCase.debit(new DebitWalletUseCase.Command(userId, amount, orderId));
  }

  public DebitWalletUseCase.Result fallback(UserId userId, Money amount, Long orderId, Exception e){
    throw new RuntimeException("Wallet circuit open - fail fast", e);
  }
}
