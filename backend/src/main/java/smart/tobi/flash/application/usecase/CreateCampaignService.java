package smart.tobi.flash.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import smart.tobi.flash.domain.model.Campaign;
import smart.tobi.flash.domain.port.in.CreateCampaignUseCase;
import smart.tobi.flash.domain.port.out.CampaignOverlapPort;
import smart.tobi.flash.domain.port.out.CampaignRepositoryPort;
import smart.tobi.flash.domain.port.out.StockPort;

import java.time.Instant;

/**
 * US-201 Application Service - implements Input Port.
 * Validates business rules: time window, overlap, stock.
 */
@Service
public class CreateCampaignService implements CreateCampaignUseCase {

  private final CampaignRepositoryPort campaignRepo;
  private final CampaignOverlapPort overlapPort;
  private final StockPort stockPort;

  public CreateCampaignService(CampaignRepositoryPort campaignRepo,
                               CampaignOverlapPort overlapPort,
                               StockPort stockPort) {
    this.campaignRepo = campaignRepo;
    this.overlapPort = overlapPort;
    this.stockPort = stockPort;
  }

  @Override
  @Transactional
  public Campaign create(Command cmd) {
    // Rule 1: time window valid
    if (cmd.startAt().isAfter(cmd.endAt()) || cmd.startAt().isBefore(Instant.now().minusSeconds(60))) {
      throw new InvalidTimeWindowException("startAt must be before endAt and not in past");
    }
    if (cmd.stockTotal() <= 0 || cmd.maxPerUser() <= 0 || cmd.maxPerUser() > cmd.stockTotal()) {
      throw new IllegalArgumentException("stockTotal and maxPerUser invalid");
    }
    // Rule 2: no overlapping campaign for same product (Interval Scheduling DSA)
    if (overlapPort.existsOverlapping(cmd.productId(), cmd.startAt(), cmd.endAt())) {
      throw new OverlappingCampaignException(
          "Overlapping campaign exists for product " + cmd.productId());
    }

    Campaign toSave = new Campaign(
        null,
        cmd.productId(),
        cmd.stockTotal(),
        cmd.stockTotal(),
        cmd.startAt(),
        cmd.endAt(),
        cmd.maxPerUser(),
        Campaign.CampaignStatus.ACTIVE,
        0L
    );

    Campaign saved = campaignRepo.save(toSave);

    // Rule 3: init Redis stock atomically (for US-204 later)
    stockPort.setStock(saved.id(), saved.stockTotal());

    return saved;
  }
}
