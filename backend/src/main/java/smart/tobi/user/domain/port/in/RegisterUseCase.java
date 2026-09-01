package smart.tobi.user.domain.port.in;

import smart.tobi.user.domain.model.User;

public interface RegisterUseCase {
  User register(Command cmd);
  record Command(String email, String password, String displayName) {}
  class EmailAlreadyExistsException extends RuntimeException { public EmailAlreadyExistsException(String m){super(m);} }
}
