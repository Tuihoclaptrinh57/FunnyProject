package smart.tobi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * SmartTobi SuperApp - Modular Monolith Entry
 * Domains: api.smart.tobi, live.smart.tobi, flash.smart.tobi
 * Packages: smart.tobi.* (hexagonal per module)
 */
@SpringBootApplication
@EnableScheduling
public class SmartTobiApplication {
  public static void main(String[] args) {
    SpringApplication.run(SmartTobiApplication.class, args);
  }
}
