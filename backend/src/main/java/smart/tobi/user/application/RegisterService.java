package smart.tobi.user.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import smart.tobi.user.domain.model.User;
import smart.tobi.user.domain.port.in.RegisterUseCase;
import smart.tobi.user.domain.port.out.PasswordEncoderPort;
import smart.tobi.user.domain.port.out.UserRepositoryPort;

import java.time.Instant;

@Service
public class RegisterService implements RegisterUseCase {
  private final UserRepositoryPort userRepo;
  private final PasswordEncoderPort encoder;
  public RegisterService(UserRepositoryPort userRepo, PasswordEncoderPort encoder) { this.userRepo=userRepo; this.encoder=encoder; }

  @Override @Transactional
  public User register(Command cmd) {
    User.validateEmail(cmd.email());
    if (cmd.password()==null || cmd.password().length()<6) throw new IllegalArgumentException("Password too short");
    if (userRepo.existsByEmail(cmd.email())) throw new EmailAlreadyExistsException("Email already exists");
    var user = new User(null, cmd.email().toLowerCase(), encoder.encode(cmd.password()), cmd.displayName(), Instant.now());
    return userRepo.save(user);
  }
}
