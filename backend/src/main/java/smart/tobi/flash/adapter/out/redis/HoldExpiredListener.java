package smart.tobi.flash.adapter.out.redis;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import smart.tobi.flash.domain.port.out.StockPort;

/**
 * M1 Deep-dive: No cron job for hold expiry - use Redis keyspace notification
 * When hold:{dealId}:{userId} expires (TTL 600s), Redis publishes to __keyevent@0__:expired
 * Listener subscribes and Lua increments stock atomically - no polling, no leak
 * Enable in redis.conf: notify-keyspace-events Ex
 */
@Component
public class HoldExpiredListener implements MessageListener {
  private final StringRedisTemplate redis;
  private final StockPort stockPort;

  public HoldExpiredListener(StringRedisTemplate redis, StockPort stockPort) {
    this.redis = redis;
    this.stockPort = stockPort;
  }

  @Override
  public void onMessage(Message message, byte[] pattern) {
    String expiredKey = new String(message.getBody());
    if (expiredKey.startsWith("hold:")) {
      // hold:{dealId}:{userId} -> extract dealId
      try {
        String[] parts = expiredKey.split(":");
        Long dealId = Long.valueOf(parts[1]);
        // Lua: incr stock atomically (avoid race with concurrent reserve)
        stockPort.increment(dealId, 1);
        // Also remove from queue ZSET if still there
        redis.opsForZSet().remove("queue:" + dealId, parts[2]);
      } catch (Exception ignored) {}
    }
  }
}
