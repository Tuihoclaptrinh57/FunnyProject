package smart.tobi.seller.application;

import org.springframework.stereotype.Service;
import smart.tobi.seller.domain.model.DealDraft;
import smart.tobi.seller.domain.port.in.SyncDraftUseCase;
import smart.tobi.seller.domain.port.out.DealDraftRepositoryPort;

import java.time.Instant;
import java.util.Map;

@Service
public class SyncDraftService implements SyncDraftUseCase {
  private final DealDraftRepositoryPort repo;
  public SyncDraftService(DealDraftRepositoryPort repo){this.repo=repo;}

  @Override public DealDraft sync(Command cmd){
    var draft = repo.findById(cmd.draftId()).orElse(DealDraft.create("Untitled"));
    // For demo: LWW-map simple - merge yjsUpdate (base64) into state, in prod use Yjs Hocuspocus
    var updated = new DealDraft(draft.id(), draft.title(), draft.description(), draft.price(), Map.of("yjs", cmd.yjsUpdateBase64()), Instant.now());
    return repo.save(updated);
  }
}
