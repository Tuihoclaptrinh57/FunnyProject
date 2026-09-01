package smart.tobi.wallet.adapter.out.persistence;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity @Table(name = "ledger")
public class LedgerJpaEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private Long walletId;
  private Long userId;
  private BigDecimal amount;
  private String currency;
  private String type;
  private Long refId;
  private Instant createdAt;
  public Long getId(){return id;} public void setId(Long v){id=v;}
  public Long getWalletId(){return walletId;} public void setWalletId(Long v){walletId=v;}
  public Long getUserId(){return userId;} public void setUserId(Long v){userId=v;}
  public BigDecimal getAmount(){return amount;} public void setAmount(BigDecimal v){amount=v;}
  public String getCurrency(){return currency;} public void setCurrency(String v){currency=v;}
  public String getType(){return type;} public void setType(String v){type=v;}
  public Long getRefId(){return refId;} public void setRefId(Long v){refId=v;}
  public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
}
