package smart.tobi.user.adapter.out.persistence;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "app_user", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class UserJpaEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(nullable=false, unique=true) private String email;
  @Column(nullable=false) private String passwordHash;
  private String displayName;
  private Instant createdAt;
  public Long getId(){return id;} public void setId(Long v){id=v;}
  public String getEmail(){return email;} public void setEmail(String v){email=v;}
  public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String v){passwordHash=v;}
  public String getDisplayName(){return displayName;} public void setDisplayName(String v){displayName=v;}
  public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
}
