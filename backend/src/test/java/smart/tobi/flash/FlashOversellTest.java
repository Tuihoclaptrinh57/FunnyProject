package smart.tobi.flash;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import smart.tobi.flash.domain.port.in.CreateCampaignUseCase;
import smart.tobi.flash.domain.port.in.JoinFlashSaleUseCase;
import smart.tobi.flash.domain.port.out.StockPort;

import java.time.Instant;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * US-204: Test chống oversell - 100 threads đồng thời với stock=5, chỉ 5 thành công.
 * DSA: Redis Lua + DB optimistic lock
 */
@SpringBootTest
@Testcontainers
public class FlashOversellTest {

  @Container static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

  @DynamicPropertySource
  static void props(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url", postgres::getJdbcUrl);
    r.add("spring.datasource.username", postgres::getUsername);
    r.add("spring.datasource.password", postgres::getPassword);
  }

  @Autowired CreateCampaignUseCase createUseCase;
  @Autowired JoinFlashSaleUseCase joinUseCase;
  @Autowired StockPort stockPort;

  @Test
  void oversellShouldNotHappen() throws Exception {
    var campaign = createUseCase.create(new CreateCampaignUseCase.Command(
        999L, 5, Instant.now().plusSeconds(1), Instant.now().plusSeconds(3600), 2, 1L));
    Thread.sleep(1100); // wait active
    // ensure Redis stock =5
    assertThat(stockPort.getStock(campaign.id())).isEqualTo(5);

    int threads = 100;
    var latch = new CountDownLatch(threads);
    var executor = Executors.newFixedThreadPool(20);
    var success = new AtomicInteger(0);
    var soldOut = new AtomicInteger(0);

    for (int i = 0; i < threads; i++) {
      final long userId = i;
      executor.submit(() -> {
        try {
          var res = joinUseCase.join(new JoinFlashSaleUseCase.Command(campaign.id(), userId, 1, "key-" + userId));
          if ("HOLD_CREATED".equals(res.status())) success.incrementAndGet();
          if ("SOLD_OUT".equals(res.status())) soldOut.incrementAndGet();
        } finally { latch.countDown(); }
      });
    }
    latch.await();
    executor.shutdown();

    assertThat(success.get()).isEqualTo(5);
    assertThat(soldOut.get()).isEqualTo(95);
    assertThat(stockPort.getStock(campaign.id())).isEqualTo(0);
  }
}
