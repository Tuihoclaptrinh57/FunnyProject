package smart.tobi.wallet.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SpringDataWalletRepository extends JpaRepository<WalletJpaEntity, Long> {
  Optional<WalletJpaEntity> findByUserId(Long userId);
}
