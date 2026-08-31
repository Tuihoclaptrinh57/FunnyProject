package smart.tobi.user.application;

import org.springframework.stereotype.Service;
import smart.tobi.user.domain.port.in.LoginUseCase;
import smart.tobi.user.domain.port.out.PasswordEncoderPort;
import smart.tobi.user.domain.port.out.TokenPort;
import smart.tobi.user.domain.port.out.UserRepositoryPort;

@Service
public class LoginService implements LoginUseCase {
  private final UserRepositoryPort userRepo;
  private final PasswordEncoderPort encoder;
  private final TokenPort tokenPort;
  public LoginService(UserRepositoryPort userRepo, PasswordEncoderPort encoder, TokenPort tokenPort) { this.userRepo=userRepo; this.encoder=encoder; this.tokenPort=tokenPort; }

  @Override
  public Result login(Command cmd) {
    var user = userRepo.findByEmail(cmd.email().toLowerCase()).orElseThrow(() -> new BadCredentialsException("Bad credentials"));
    if (!encoder.matches(cmd.password(), user.passwordHash())) throw new BadCredentialsException("Bad credentials");
    return new Result(tokenPort.generateAccessToken(user.id(), user.email()), tokenPort.generateRefreshToken(user.id()), user.id());
  }
}
