package smart.tobi.live.application;

import org.springframework.stereotype.Service;
import smart.tobi.live.domain.model.LiveSession;
import smart.tobi.live.domain.port.in.StartLiveUseCase;
import smart.tobi.live.domain.port.out.LiveSessionRepositoryPort;

@Service
public class StartLiveService implements StartLiveUseCase {
  private final LiveSessionRepositoryPort repo;
  public StartLiveService(LiveSessionRepositoryPort repo){this.repo=repo;}
  @Override public LiveSession start(Command cmd){
    var session = LiveSession.start(cmd.title(), cmd.sellerId());
    return repo.save(session);
  }
}
