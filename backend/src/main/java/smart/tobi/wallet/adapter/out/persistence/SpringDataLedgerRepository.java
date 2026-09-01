package smart.tobi.wallet.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataLedgerRepository extends JpaRepository<LedgerJpaEntity, Long> {
}
