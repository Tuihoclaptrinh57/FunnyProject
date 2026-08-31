package smart.tobi.flash.domain.port.out;

import smart.tobi.flash.domain.model.Campaign;
import java.util.Optional;

public interface CampaignRepositoryPort {
  Optional<Campaign> findById(Long id);
  Campaign save(Campaign campaign);
}
