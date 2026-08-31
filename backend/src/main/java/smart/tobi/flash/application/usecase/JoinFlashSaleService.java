package smart.tobi.flash.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import smart.tobi.flash.domain.port.in.JoinFlashSaleUseCase;
import smart.tobi.flash.domain.port.out.CampaignRepositoryPort;
import smart.tobi.flash.domain.port.out.StockPort;

import java.time.Instant;
import java.util.UUID;

/**
 * Application Service - implements Input Port. Contains business rule.
 * Hexagonal: depends only on ports (interfaces), not on Redis/JPA.
 */
@Service
public class JoinFlashSaleService implements JoinFlashSaleUseCase {

  private final CampaignRepositoryPort campaignPort;
  private final StockPort stockPort;

  public JoinFlashSaleService(CampaignRepositoryPort campaignPort, StockPort stockPort) {
    this.campaignPort = campaignPort;
    this.stockPort = stockPort;
  }

  @Override
  @Transactional
  public Result join(Command cmd) {
    var campaign = campaignPort.findById(cmd.campaignId())
        .orElseThrow(() -> new IllegalArgumentException("Campaign not found"));

    if (!campaign.isActive(Instant.now())) {
      return new Result("NOT_ACTIVE", null, null, null);
    }
    if (cmd.quantity() > campaign.maxPerUser()) {
      return new Result("LIMIT_EXCEEDED", null, null, null);
    }

    // DSA: Lua atomic decr - chống oversell, không cần distributed lock
    long remaining = stockPort.tryDecrement(cmd.campaignId(), cmd.quantity());
    if (remaining < 0) {
      // TODO Phase 2: enqueue to Redis ZSet (priority queue FIFO) -> return QUEUED with ticket
      return new Result("SOLD_OUT", null, null, null);
    }

    // Hold 10 phút - tạo holdId, lưu Redis TTL 600s (impl ở adapter)
    String holdId = UUID.randomUUID().toString();
    // stockHoldPort.save(hold) -> Redis + DB
    return new Result("HOLD_CREATED", holdId, null, null);
  }
}
