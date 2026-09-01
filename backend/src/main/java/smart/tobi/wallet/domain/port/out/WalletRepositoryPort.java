package smart.tobi.wallet.domain.port.out;

import smart.tobi.shared.domain.UserId;
import smart.tobi.wallet.domain.model.Wallet;
import java.util.Optional;

public interface WalletRepositoryPort {
  Optional<Wallet> findByUserId(UserId userId);
  Wallet save(Wallet wallet);
  Wallet getOrCreate(UserId userId);
}
