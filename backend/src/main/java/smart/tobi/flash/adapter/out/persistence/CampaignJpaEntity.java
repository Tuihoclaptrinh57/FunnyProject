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

  public Long getId() { return id; } public void setId(Long id) { this.id = id; }
  public Long getProductId() { return productId; } public void setProductId(Long v) { this.productId = v; }
  public int getStockTotal() { return stockTotal; } public void setStockTotal(int v) { this.stockTotal = v; }
  public int getStockRemaining() { return stockRemaining; } public void setStockRemaining(int v) { this.stockRemaining = v; }
  public Instant getStartAt() { return startAt; } public void setStartAt(Instant v) { this.startAt = v; }
  public Instant getEndAt() { return endAt; } public void setEndAt(Instant v) { this.endAt = v; }
  public int getMaxPerUser() { return maxPerUser; } public void setMaxPerUser(int v) { this.maxPerUser = v; }
  public String getStatus() { return status; } public void setStatus(String v) { this.status = v; }
  public long getVersion() { return version; } public void setVersion(long v) { this.version = v; }
}
