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
    // Deep-dive: Seller A gõ price -> local LWW entry (value, timestamp, replicaId) -> WS debounce 150ms -> server merge LWW (timestamp wins) -> broadcast to B -> B merge local -> re-render
    // Server is central replica for broadcast, but merge is true CRDT convergent (2 clients direct merge also converge, not just server relay)
    // LWW-Map for title/price/quantity, Yjs only for description rich text - not whole form in 1 CRDT
    // Note: CRDT solves structure conflict, not business conflict - 2 sellers same price, LWW picks last timestamp, but need UI show "field just edited by X" via replicaId
    var updated = new DealDraft(draft.id(), draft.title(), draft.description(), draft.price(), Map.of("yjs", cmd.yjsUpdateBase64()), Instant.now());
    return repo.save(updated);
  }
}
