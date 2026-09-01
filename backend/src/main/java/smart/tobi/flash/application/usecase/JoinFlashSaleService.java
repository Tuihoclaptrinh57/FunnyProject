package smart.tobi.flash.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import smart.tobi.flash.domain.model.StockHold;
import smart.tobi.flash.domain.port.in.JoinFlashSaleUseCase;
import smart.tobi.flash.domain.port.out.CampaignRepositoryPort;
import smart.tobi.flash.domain.port.out.HoldPort;
import smart.tobi.flash.domain.port.out.QueuePort;
import smart.tobi.flash.domain.port.out.StockPort;
import smart.tobi.shared.domain.FlashSaleJoinedEvent;
import smart.tobi.shared.domain.UserId;
import smart.tobi.shared.eventbus.EventPublisherPort;

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
  private final HoldPort holdPort;
  private final EventPublisherPort eventPublisher;

  public JoinFlashSaleService(CampaignRepositoryPort campaignPort, StockPort stockPort, QueuePort queuePort, HoldPort holdPort, EventPublisherPort eventPublisher) {
    this.campaignPort = campaignPort;
    this.stockPort = stockPort;
    this.queuePort = queuePort;
    this.holdPort = holdPort;
    this.eventPublisher = eventPublisher;
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

    // M1 Deep-dive: JoinQueueUseCase -> StockRepositoryPort.tryReserve (5-step Lua atomic)
    // Steps in Lua (single Redis call, no interleaving): check stock, decr, set hold:{dealId}:{userId} EX 600, ZADD queue:{dealId} timestamp, return rank
    // Hexagonal: use case only calls tryReserve, no Redis knowledge - adapter handles Lua
    long position = stockPort.tryReserve(cmd.campaignId(), cmd.userId(), 600);
    if (position < 0) {
      return new Result("REJECTED", null, null, null); // out_of_stock - no publish
    }

    // Success -> publish FlashSaleJoinedEvent for M2 Live to update viewer/queue display
    var heldUntil = Instant.now().plusSeconds(600);
    eventPublisher.publish(new FlashSaleJoinedEvent(UserId.of(cmd.userId()), cmd.campaignId(), heldUntil));

    // Persist hold for tracking (Redis hold already set via Lua, this is DB record)
    String holdId = "hold:" + cmd.campaignId() + ":" + cmd.userId();
    var hold = new StockHold(holdId, cmd.campaignId(), cmd.userId(), cmd.quantity(), heldUntil, StockHold.HoldStatus.ACTIVE, Instant.now());
    try { holdPort.create(hold); } catch (Exception ignored) {}

    // Also keep DB stock for non-hot path (optional, not on hot path per deep-dive: Redis is gate, Postgres for order after checkout)
    try { campaignPort.decrementStock(cmd.campaignId(), cmd.quantity()); } catch (Exception ignored) {}

    return new Result("HOLD_CREATED", holdId, String.valueOf(position), (int) position);
  }
}
