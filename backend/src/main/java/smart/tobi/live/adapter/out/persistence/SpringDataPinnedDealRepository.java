package smart.tobi.live.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SpringDataPinnedDealRepository extends JpaRepository<PinnedDealJpaEntity, Long> {
  Optional<PinnedDealJpaEntity> findBySessionId(Long sessionId);
}
