package smart.tobi.live.adapter.out.persistence;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "live_pinned_deal")
public class PinnedDealJpaEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private Long sessionId;
  private Long dealId;
  private Instant pinnedAt;
  public Long getId(){return id;} public void setId(Long v){id=v;}
  public Long getSessionId(){return sessionId;} public void setSessionId(Long v){sessionId=v;}
  public Long getDealId(){return dealId;} public void setDealId(Long v){dealId=v;}
  public Instant getPinnedAt(){return pinnedAt;} public void setPinnedAt(Instant v){pinnedAt=v;}
}
