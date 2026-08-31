package smart.tobi.user.adapter.out.persistence;

import org.springframework.stereotype.Component;
import smart.tobi.user.domain.model.User;
import smart.tobi.user.domain.port.out.UserRepositoryPort;
import java.util.Optional;

@Component
public class UserRepositoryAdapter implements UserRepositoryPort {
  private final SpringDataUserRepository jpa;
  public UserRepositoryAdapter(SpringDataUserRepository jpa){this.jpa=jpa;}
  private User toDomain(UserJpaEntity e){ return new User(e.getId(), e.getEmail(), e.getPasswordHash(), e.getDisplayName(), e.getCreatedAt()); }
  private UserJpaEntity toEntity(User d){ var e=new UserJpaEntity(); e.setId(d.id()); e.setEmail(d.email()); e.setPasswordHash(d.passwordHash()); e.setDisplayName(d.displayName()); e.setCreatedAt(d.createdAt()); return e; }
  @Override public Optional<User> findByEmail(String email){ return jpa.findByEmail(email).map(this::toDomain); }
  @Override public Optional<User> findById(Long id){ return jpa.findById(id).map(this::toDomain); }
  @Override public User save(User user){ return toDomain(jpa.save(toEntity(user))); }
  @Override public boolean existsByEmail(String email){ return jpa.existsByEmail(email); }
}
