package smart.tobi.seller.adapter.out.persistence;

import org.springframework.stereotype.Component;
import smart.tobi.seller.domain.model.DealDraft;
import smart.tobi.seller.domain.port.out.DealDraftRepositoryPort;
import java.util.Map;
import java.util.Optional;

@Component
public class DealDraftRepositoryAdapter implements DealDraftRepositoryPort {
  private final SpringDataDealDraftRepository jpa;
  public DealDraftRepositoryAdapter(SpringDataDealDraftRepository jpa){this.jpa=jpa;}

  private DealDraft toDomain(DealDraftJpaEntity e){
    return new DealDraft(e.getId(), e.getTitle(), e.getDescription(), e.getPrice(), Map.of("yjs", e.getYjsStateJson()), e.getUpdatedAt());
  }
  private DealDraftJpaEntity toEntity(DealDraft d){
    var e=new DealDraftJpaEntity(); e.setId(d.id()); e.setTitle(d.title()); e.setDescription(d.description()); e.setPrice(d.price()); e.setYjsStateJson(d.yjsState() != null ? d.yjsState().toString() : "{}"); e.setUpdatedAt(d.updatedAt()); return e;
  }

  @Override public Optional<DealDraft> findById(Long id){ return jpa.findById(id).map(this::toDomain); }
  @Override public DealDraft save(DealDraft draft){ return toDomain(jpa.save(toEntity(draft))); }
}
