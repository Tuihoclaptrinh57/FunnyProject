package smart.tobi.flash.adapter.out.persistence;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "flash_stock_hold")
public class StockHoldJpaEntity {
  @Id private String id;
  private Long campaignId;
  private Long userId;
  private int quantity;
  private Instant expiresAt;
  private String status;
  private Instant createdAt;
  public String getId() { return id; } public void setId(String v) { id=v; }
  public Long getCampaignId() { return campaignId; } public void setCampaignId(Long v) { campaignId=v; }
  public Long getUserId() { return userId; } public void setUserId(Long v) { userId=v; }
  public int getQuantity() { return quantity; } public void setQuantity(int v) { quantity=v; }
  public Instant getExpiresAt() { return expiresAt; } public void setExpiresAt(Instant v) { expiresAt=v; }
  public String getStatus() { return status; } public void setStatus(String v) { status=v; }
  public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant v) { createdAt=v; }
}
