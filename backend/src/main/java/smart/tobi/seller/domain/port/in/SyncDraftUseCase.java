package smart.tobi.seller.domain.port.in;

import smart.tobi.seller.domain.model.DealDraft;

public interface SyncDraftUseCase {
  DealDraft sync(Command cmd);
  record Command(Long draftId, String yjsUpdateBase64, Long userId) {}
}
