package smart.tobi.feed.adapter.out.persistence;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "post")
public class PostJpaEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private Long authorId;
  private String content;
  private Long dealId;
  private Instant createdAt;
  public Long getId(){return id;} public void setId(Long v){id=v;}
  public Long getAuthorId(){return authorId;} public void setAuthorId(Long v){authorId=v;}
  public String getContent(){return content;} public void setContent(String v){content=v;}
  public Long getDealId(){return dealId;} public void setDealId(Long v){dealId=v;}
  public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
}
