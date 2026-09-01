package smart.tobi.flash.domain.port.out;

import smart.tobi.flash.domain.model.Campaign;
import java.util.Optional;

public interface CampaignRepositoryPort {
  Optional<Campaign> findById(Long id);
  Campaign save(Campaign campaign);
  /**
   * US-204: Decrement stock_remaining atomically with optimistic lock.
   * Throws ObjectOptimisticLockingFailureException if version conflict.
   */
  void decrementStock(Long campaignId, int quantity);
}
