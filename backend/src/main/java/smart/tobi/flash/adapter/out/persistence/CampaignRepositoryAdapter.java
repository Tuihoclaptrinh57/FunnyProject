package smart.tobi.flash.adapter.out.persistence;

import org.springframework.stereotype.Component;
import smart.tobi.flash.domain.model.Campaign;
import smart.tobi.flash.domain.port.out.CampaignOverlapPort;
import smart.tobi.flash.domain.port.out.CampaignRepositoryPort;

import java.time.Instant;
import java.util.Optional;

/**
 * Adapter Out - Persistence implements 2 ports: Repository + Overlap check.
 */
@Component
public class CampaignRepositoryAdapter implements CampaignRepositoryPort, CampaignOverlapPort {

  private final SpringDataCampaignRepository jpa;

  public CampaignRepositoryAdapter(SpringDataCampaignRepository jpa) {
    this.jpa = jpa;
  }

  @Override
  public Optional<Campaign> findById(Long id) {
    return jpa.findById(id).map(this::toDomain);
  }

  @Override
  public Campaign save(Campaign campaign) {
    var entity = toEntity(campaign);
    var saved = jpa.save(entity);
    return toDomain(saved);
  }

  @Override
  public boolean existsOverlapping(Long productId, Instant startAt, Instant endAt) {
    return jpa.existsOverlapping(productId, startAt, endAt);
  }

  private Campaign toDomain(CampaignJpaEntity e) {
    return new Campaign(
        e.getId(),
        e.getProductId(),
        e.getStockTotal(),
        e.getStockRemaining(),
        e.getStartAt(),
        e.getEndAt(),
        e.getMaxPerUser(),
        Campaign.CampaignStatus.valueOf(e.getStatus()),
        e.getVersion()
    );
  }

  private CampaignJpaEntity toEntity(Campaign d) {
    var e = new CampaignJpaEntity();
    e.setId(d.id());
    e.setProductId(d.productId());
    e.setStockTotal(d.stockTotal());
    e.setStockRemaining(d.stockRemaining());
    e.setStartAt(d.startAt());
    e.setEndAt(d.endAt());
    e.setMaxPerUser(d.maxPerUser());
    e.setStatus(d.status().name());
    e.setVersion(d.version());
    return e;
  }
}
