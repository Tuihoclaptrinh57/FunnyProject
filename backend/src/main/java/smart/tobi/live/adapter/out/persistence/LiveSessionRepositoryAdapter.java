package smart.tobi.live.adapter.out.persistence;

import org.springframework.stereotype.Component;
import smart.tobi.live.domain.model.LiveSession;
import smart.tobi.live.domain.model.PinnedDeal;
import smart.tobi.live.domain.port.out.LiveSessionRepositoryPort;
import java.util.Optional;

@Component
public class LiveSessionRepositoryAdapter implements LiveSessionRepositoryPort {
  private final SpringDataLiveSessionRepository sessionRepo;
  private final SpringDataPinnedDealRepository pinnedRepo;
  public LiveSessionRepositoryAdapter(SpringDataLiveSessionRepository sessionRepo, SpringDataPinnedDealRepository pinnedRepo){this.sessionRepo=sessionRepo; this.pinnedRepo=pinnedRepo;}

  private LiveSession toDomain(LiveSessionJpaEntity e){ return new LiveSession(e.getId(), e.getTitle(), e.getSellerId(), e.getStatus(), e.getStartedAt(), e.getEndedAt()); }
  private LiveSessionJpaEntity toEntity(LiveSession d){ var e=new LiveSessionJpaEntity(); e.setId(d.id()); e.setTitle(d.title()); e.setSellerId(d.sellerId()); e.setStatus(d.status()); e.setStartedAt(d.startedAt()); e.setEndedAt(d.endedAt()); return e; }

  @Override public LiveSession save(LiveSession session){ return toDomain(sessionRepo.save(toEntity(session))); }
  @Override public Optional<LiveSession> findById(Long id){ return sessionRepo.findById(id).map(this::toDomain); }
  @Override public PinnedDeal savePinned(PinnedDeal pinned){
    var e=new PinnedDealJpaEntity(); e.setId(pinned.id()); e.setSessionId(pinned.sessionId()); e.setDealId(pinned.dealId()); e.setPinnedAt(pinned.pinnedAt());
    var saved=pinnedRepo.save(e);
    return new PinnedDeal(saved.getId(), saved.getSessionId(), saved.getDealId(), saved.getPinnedAt());
  }
  @Override public Optional<PinnedDeal> findPinnedBySession(Long sessionId){ return pinnedRepo.findBySessionId(sessionId).map(e-> new PinnedDeal(e.getId(), e.getSessionId(), e.getDealId(), e.getPinnedAt())); }
}
