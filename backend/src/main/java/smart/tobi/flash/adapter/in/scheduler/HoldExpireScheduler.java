package smart.tobi.flash.adapter.in.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import smart.tobi.flash.adapter.out.persistence.SpringDataHoldRepository;
import smart.tobi.flash.domain.port.out.HoldPort;

import java.time.Instant;

/**
 * US-203: Scheduler nhả hàng hết hạn mỗi 60s (fallback nếu Redis keyspace notification không bật)
 */
@Component
public class HoldExpireScheduler {

  private final SpringDataHoldRepository holdRepo;
  private final HoldPort holdPort;

  public HoldExpireScheduler(SpringDataHoldRepository holdRepo, HoldPort holdPort) {
    this.holdRepo = holdRepo; this.holdPort = holdPort;
  }

  @Scheduled(fixedDelay = 60000)
  public void expireHolds() {
    var now = Instant.now();
    holdRepo.findAll().stream()
        .filter(e -> e.getExpiresAt().isBefore(now) && "ACTIVE".equals(e.getStatus()))
        .forEach(e -> holdPort.expire(e.getId()));
  }
}
