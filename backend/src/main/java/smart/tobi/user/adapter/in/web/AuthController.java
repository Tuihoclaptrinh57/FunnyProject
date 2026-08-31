package smart.tobi.user.adapter.in.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart.tobi.user.domain.port.in.LoginUseCase;
import smart.tobi.user.domain.port.in.RegisterUseCase;

@RestController @RequestMapping("/api/auth")
public class AuthController {
  private final RegisterUseCase registerUseCase;
  private final LoginUseCase loginUseCase;
  public AuthController(RegisterUseCase registerUseCase, LoginUseCase loginUseCase){this.registerUseCase=registerUseCase; this.loginUseCase=loginUseCase;}

  public record RegisterRequest(@Email String email, @NotBlank String password, String displayName){}
  public record LoginRequest(@Email String email, @NotBlank String password){}

  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req){
    var user = registerUseCase.register(new RegisterUseCase.Command(req.email(), req.password(), req.displayName()));
    return ResponseEntity.status(HttpStatus.CREATED).body(java.util.Map.of("id", user.id(), "email", user.email()));
  }

  @PostMapping("/login")
  public ResponseEntity<LoginUseCase.Result> login(@Valid @RequestBody LoginRequest req){
    var res = loginUseCase.login(new LoginUseCase.Command(req.email(), req.password()));
    return ResponseEntity.ok(res);
  }
}
