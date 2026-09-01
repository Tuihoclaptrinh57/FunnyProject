package smart.tobi.live.application;

import org.springframework.stereotype.Service;
import smart.tobi.live.domain.model.PinnedDeal;
import smart.tobi.live.domain.port.in.PinDealUseCase;
import smart.tobi.live.domain.port.out.LiveSessionRepositoryPort;

import java.time.Instant;

@Service
public class PinDealService implements PinDealUseCase {
  private final LiveSessionRepositoryPort repo;
  public PinDealService(LiveSessionRepositoryPort repo){this.repo=repo;}
  @Override public PinnedDeal pin(Command cmd){
    var pinned = new PinnedDeal(null, cmd.sessionId(), cmd.dealId(), Instant.now());
    // publish to Redis Pub/Sub for fan-out (handled in adapter)
    return repo.savePinned(pinned);
  }
}
