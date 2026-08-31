package smart.tobi.user.domain.port.out;

import smart.tobi.user.domain.model.User;
import java.util.Optional;

public interface UserRepositoryPort {
  Optional<User> findByEmail(String email);
  Optional<User> findById(Long id);
  User save(User user);
  boolean existsByEmail(String email);
}
