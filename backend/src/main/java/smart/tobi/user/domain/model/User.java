package smart.tobi.user.domain.model;

import java.time.Instant;

public record User(Long id, String email, String passwordHash, String displayName, Instant createdAt) {
  public static void validateEmail(String email) {
    if (email == null || !email.matches("^[^@]+@[^@]+\\.[^@]+$")) throw new IllegalArgumentException("Invalid email");
  }
}
