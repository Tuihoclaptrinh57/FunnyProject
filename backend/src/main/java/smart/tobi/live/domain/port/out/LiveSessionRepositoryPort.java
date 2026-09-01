package smart.tobi.live.domain.port.out;

import smart.tobi.live.domain.model.LiveSession;
import smart.tobi.live.domain.model.PinnedDeal;
import java.util.Optional;

public interface LiveSessionRepositoryPort {
  LiveSession save(LiveSession session);
  Optional<LiveSession> findById(Long id);
  PinnedDeal savePinned(PinnedDeal pinned);
  Optional<PinnedDeal> findPinnedBySession(Long sessionId);
}
