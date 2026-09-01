package smart.tobi.seller.domain.port.out;

import smart.tobi.seller.domain.model.DealDraft;
import java.util.Optional;

public interface DealDraftRepositoryPort {
  Optional<DealDraft> findById(Long id);
  DealDraft save(DealDraft draft);
}
