package smart.tobi.flash.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataHoldRepository extends JpaRepository<StockHoldJpaEntity, String> {
}
