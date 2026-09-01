package smart.tobi.live.domain.port.in;

import smart.tobi.live.domain.model.PinnedDeal;

public interface PinDealUseCase {
  PinnedDeal pin(Command cmd);
  record Command(Long sessionId, Long dealId) {}
}
