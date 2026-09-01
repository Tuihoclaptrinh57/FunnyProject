package smart.tobi.live.adapter.out.persistence;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "live_session")
public class LiveSessionJpaEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private String title;
  private Long sellerId;
  private String status;
  private Instant startedAt;
  private Instant endedAt;
  public Long getId(){return id;} public void setId(Long v){id=v;}
  public String getTitle(){return title;} public void setTitle(String v){title=v;}
  public Long getSellerId(){return sellerId;} public void setSellerId(Long v){sellerId=v;}
  public String getStatus(){return status;} public void setStatus(String v){status=v;}
  public Instant getStartedAt(){return startedAt;} public void setStartedAt(Instant v){startedAt=v;}
  public Instant getEndedAt(){return endedAt;} public void setEndedAt(Instant v){endedAt=v;}
}
