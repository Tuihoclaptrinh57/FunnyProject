package smart.tobi.user.domain.port.in;

public interface LoginUseCase {
  Result login(Command cmd);
  record Command(String email, String password) {}
  record Result(String accessToken, String refreshToken, Long userId) {}
  class BadCredentialsException extends RuntimeException { public BadCredentialsException(String m){super(m);} }
}
