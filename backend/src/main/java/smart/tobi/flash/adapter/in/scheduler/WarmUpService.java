package smart.tobi.flash.adapter.in.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import smart.tobi.flash.domain.port.out.StockPort;
import smart.tobi.flash.adapter.out.persistence.SpringDataCampaignRepository;

/**
 * 6. Cold start / warm-up for flash sale open at 00:00
 * Traffic jumps from 0 to peak in seconds - different from gradual ramp
 * Preload Redis stock:{dealId} minutes before open, and scheduled scaling for gateway
 * Auto-scale by CPU lags behind step-function traffic, so schedule scale-out before sale
 */
@Component
public class WarmUpService {
  private final StockPort stockPort;
  private final SpringDataCampaignRepository campaignRepo;
  public WarmUpService(StockPort stockPort, SpringDataCampaignRepository campaignRepo){this.stockPort=stockPort; this.campaignRepo=campaignRepo;}

  // Preload 5 minutes before each flash sale (cron every minute, check upcoming)
  @Scheduled(fixedDelay = 60000)
  public void preloadStock(){
    for (var c : campaignRepo.findAll()){
      // if sale starts in 5 minutes, preload Redis
      if (c.getStartAt().isAfter(java.time.Instant.now()) && c.getStartAt().isBefore(java.time.Instant.now().plusSeconds(300))){
        stockPort.setStock(c.getId(), c.getStockTotal());
        System.out.println("[WARM-UP] Preloaded stock:" + c.getId() + "=" + c.getStockTotal());
      }
    }
  }

  // Scheduled scaling: scale gateway before sale (e.g., 19:00 sale -> scale at 18:55)
  // In k8s: kubectl scale deployment gateway --replicas=10 --namespace=prod (via cronjob)
}
