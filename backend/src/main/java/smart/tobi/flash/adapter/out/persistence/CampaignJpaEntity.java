package smart.tobi.flash.adapter.out.persistence;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "flash_campaign")
public class CampaignJpaEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private Long productId;
  private int stockTotal;
  private int stockRemaining;
  private Instant startAt;
  private Instant endAt;
  private int maxPerUser;
  private String status;
  @Version private long version;
  // getters/setters omitted for skeleton - add Lombok @Data in real impl
  public Long getId() { return id; } public void setId(Long id) { this.id = id; }
}
