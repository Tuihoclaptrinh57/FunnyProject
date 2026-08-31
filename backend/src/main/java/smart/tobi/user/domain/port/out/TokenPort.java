package smart.tobi.user.domain.port.out;

public interface TokenPort {
  String generateAccessToken(Long userId, String email);
  String generateRefreshToken(Long userId);
  Long parseUserId(String token);
}
