package smart.tobi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * SmartTobi SuperApp - Modular Monolith Entry
 * Domains: api.smart.tobi, live.smart.tobi, flash.smart.tobi
 * Packages: smart.tobi.* (hexagonal per module)
 */
@SpringBootApplication
public class SmartTobiApplication {
  public static void main(String[] args) {
    SpringApplication.run(SmartTobiApplication.class, args);
  }
}
