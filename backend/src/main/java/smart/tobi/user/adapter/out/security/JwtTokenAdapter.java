package smart.tobi.user.adapter.out.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import smart.tobi.user.domain.port.out.TokenPort;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenAdapter implements TokenPort {
  private final SecretKey key;
  private final long accessExpMs;
  private final long refreshExpMs;

  public JwtTokenAdapter(@Value("${smart-tobi.jwt.secret:smart-tobi-dev-secret-key-32chars-long!!}") String secret,
                         @Value("${smart-tobi.jwt.access-exp-ms:3600000}") long accessExpMs,
                         @Value("${smart-tobi.jwt.refresh-exp-ms:604800000}") long refreshExpMs) {
    // ensure 32+ chars for HS256
    var padded = (secret + "00000000000000000000000000000000").substring(0,32);
    this.key = Keys.hmacShaKeyFor(padded.getBytes(StandardCharsets.UTF_8));
    this.accessExpMs = accessExpMs; this.refreshExpMs=refreshExpMs;
  }

  @Override public String generateAccessToken(Long userId, String email){
    return Jwts.builder().subject(userId.toString()).claim("email", email).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+accessExpMs)).signWith(key).compact();
  }
  @Override public String generateRefreshToken(Long userId){
    return Jwts.builder().subject(userId.toString()).claim("type","refresh").issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+refreshExpMs)).signWith(key).compact();
  }
  @Override public Long parseUserId(String token){
    return Long.valueOf(Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject());
  }
}
