package smart.tobi.wallet.adapter.out.persistence;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity @Table(name = "wallet")
public class WalletJpaEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private Long userId;
  private BigDecimal balance;
  private String currency;
  private Instant createdAt;
  private Instant updatedAt;
  public Long getId(){return id;} public void setId(Long v){id=v;}
  public Long getUserId(){return userId;} public void setUserId(Long v){userId=v;}
  public BigDecimal getBalance(){return balance;} public void setBalance(BigDecimal v){balance=v;}
  public String getCurrency(){return currency;} public void setCurrency(String v){currency=v;}
  public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
  public Instant getUpdatedAt(){return updatedAt;} public void setUpdatedAt(Instant v){updatedAt=v;}
}
