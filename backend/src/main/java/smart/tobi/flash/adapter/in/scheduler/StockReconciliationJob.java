package smart.tobi.flash.adapter.in.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import smart.tobi.flash.domain.port.out.StockPort;
import smart.tobi.flash.adapter.out.persistence.SpringDataCampaignRepository;

/**
 * 2. Consistency: Redis (gate) vs Postgres (source of truth)
 * Redis holds stock:{dealId} for speed, Postgres holds sold_count for order/report
 * After checkout, Order written to Postgres in same transaction as sold_count
 * This job reconciles: stock:{dealId} + sold_count should == stock_total, else alert (don't auto-fix silently)
 */
@Component
public class StockReconciliationJob {
  private final StockPort stockPort;
  private final SpringDataCampaignRepository campaignRepo;
  public StockReconciliationJob(StockPort stockPort, SpringDataCampaignRepository campaignRepo){this.stockPort=stockPort; this.campaignRepo=campaignRepo;}

  @Scheduled(cron = "0 0 * * * *") // hourly or after each flash sale
  public void reconcile(){
    for (var c : campaignRepo.findAll()){
      long redisStock = stockPort.getStock(c.getId());
      long dbSold = c.getStockTotal() - c.getStockRemaining();
      long expectedRedis = c.getStockTotal() - dbSold;
      if (redisStock != expectedRedis){
        System.err.println("[RECONCILE ALERT] deal " + c.getId() + " redis=" + redisStock + " expected=" + expectedRedis + " dbSold=" + dbSold);
        // alert, not auto-fix
      }
    }
  }
}
