package smart.tobi.user.adapter.out.security;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import smart.tobi.user.domain.port.out.PasswordEncoderPort;

@Component
public class PasswordEncoderAdapter implements PasswordEncoderPort {
  private final PasswordEncoder delegate;
  public PasswordEncoderAdapter(PasswordEncoder delegate){this.delegate=delegate;}
  @Override public String encode(String raw){ return delegate.encode(raw); }
  @Override public boolean matches(String raw, String encoded){ return delegate.matches(raw, encoded); }
}
