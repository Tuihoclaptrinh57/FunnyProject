package smart.tobi.live.domain.port.in;

import smart.tobi.live.domain.model.LiveSession;

public interface StartLiveUseCase {
  LiveSession start(Command cmd);
  record Command(String title, Long sellerId) {}
}
