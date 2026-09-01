package smart.tobi.seller.adapter.out.persistence;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "deal_draft")
public class DealDraftJpaEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private String title;
  private String description;
  private Double price;
  @Column(columnDefinition = "TEXT") private String yjsStateJson;
  private Instant updatedAt;
  public Long getId(){return id;} public void setId(Long v){id=v;}
  public String getTitle(){return title;} public void setTitle(String v){title=v;}
  public String getDescription(){return description;} public void setDescription(String v){description=v;}
  public Double getPrice(){return price;} public void setPrice(Double v){price=v;}
  public String getYjsStateJson(){return yjsStateJson;} public void setYjsStateJson(String v){yjsStateJson=v;}
  public Instant getUpdatedAt(){return updatedAt;} public void setUpdatedAt(Instant v){updatedAt=v;}
}
