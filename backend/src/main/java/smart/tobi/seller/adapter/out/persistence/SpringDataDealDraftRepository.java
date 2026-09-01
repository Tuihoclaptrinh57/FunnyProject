package smart.tobi.seller.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataDealDraftRepository extends JpaRepository<DealDraftJpaEntity, Long> {
}
