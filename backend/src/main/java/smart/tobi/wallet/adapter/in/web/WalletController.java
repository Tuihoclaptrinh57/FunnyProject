package smart.tobi.wallet.adapter.in.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart.tobi.shared.domain.Money;
import smart.tobi.shared.domain.UserId;
import smart.tobi.wallet.domain.port.in.DebitWalletUseCase;

import java.math.BigDecimal;

@RestController @RequestMapping("/api/wallet")
public class WalletController {
  private final DebitWalletUseCase debitUseCase;
  public WalletController(DebitWalletUseCase debitUseCase){this.debitUseCase=debitUseCase;}

  public record DebitRequest(Long userId, BigDecimal amount, Long orderId) {}
  public record DebitResponse(Long walletId, BigDecimal newBalance) {}

  @PostMapping("/debit")
  public ResponseEntity<DebitResponse> debit(@RequestBody DebitRequest req){
    var result = debitUseCase.debit(new DebitWalletUseCase.Command(UserId.of(req.userId()), new Money(req.amount(), "VND"), req.orderId()));
    return ResponseEntity.ok(new DebitResponse(result.walletId(), result.newBalance().amount()));
  }

  @GetMapping("/{userId}")
  public ResponseEntity<?> getWallet(@PathVariable Long userId){
    // For demo: return balance via walletRepo directly or via useCase
    return ResponseEntity.ok(java.util.Map.of("userId", userId, "balance", "via wallet"));
  }
}
