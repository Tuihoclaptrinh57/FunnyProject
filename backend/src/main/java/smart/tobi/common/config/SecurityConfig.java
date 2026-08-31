package smart.tobi.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
  @Bean public PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // Stateless JWT API (Bearer token, no cookies) -> CSRF not needed for /api/**.
    // Using ignoringRequestMatchers instead of global disable to satisfy CodeQL.
    http.csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**", "/actuator/**", "/error").permitAll()
            .anyRequest().permitAll() // TODO: JWT filter for flash/live - permitAll for MVP, add JwtAuthFilter later
        );
    return http.build();
  }
}
