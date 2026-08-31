package smart.tobi.flash.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import smart.tobi.flash.domain.port.in.JoinFlashSaleUseCase;
import smart.tobi.flash.domain.port.out.CampaignRepositoryPort;
import smart.tobi.flash.domain.port.out.QueuePort;
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
  private final QueuePort queuePort;

  public JoinFlashSaleService(CampaignRepositoryPort campaignPort, StockPort stockPort, QueuePort queuePort) {
    this.campaignPort = campaignPort;
    this.stockPort = stockPort;
    this.queuePort = queuePort;
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

    // US-202 + US-204: Lua atomic decr; if SOLD_OUT -> enqueue FIFO queue (ZSet score=timestamp)
    long remaining = stockPort.tryDecrement(cmd.campaignId(), cmd.quantity());
    if (remaining < 0) {
      var ticket = queuePort.enqueue(cmd.campaignId(), cmd.userId(), cmd.quantity());
      return new Result("QUEUED", null, ticket.id(), (int) ticket.position());
    }

    // Compensate DB stock_remaining (optimistic lock via @Version, retry ở caller nếu ObjectOptimisticLockingFailure)
    try {
      campaignPort.decrementStock(cmd.campaignId(), cmd.quantity());
    } catch (Exception e) {
      // Compensate Redis nếu DB fail
      stockPort.increment(cmd.campaignId(), cmd.quantity());
      throw e;
    }

    String holdId = UUID.randomUUID().toString();
    // TODO US-203: persist hold to Redis TTL 600s + DB flash_stock_hold
    return new Result("HOLD_CREATED", holdId, null, null);
  }
}
