package smart.tobi.flash.adapter.out.redis;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;
import smart.tobi.flash.domain.port.out.StockPort;

import java.util.List;

/**
 * Adapter Out - Redis. Implements StockPort via Lua atomic.
 * DSA: Redis Lua ensures no oversell under 50k RPS.
 */
@Component
public class RedisStockAdapter implements StockPort {

  private final StringRedisTemplate redis;

  // Lua: if stock >= qty then decr else -1
  private static final String LUA_DECR =
      "local stock = tonumber(redis.call('get', KEYS[1]) or '0'); " +
      "local qty = tonumber(ARGV[1]); " +
      "if stock >= qty then redis.call('decrby', KEYS[1], qty); return stock - qty; else return -1; end";

  // M1 Deep-dive 5-step atomic: check stock, decr, set hold with TTL, ZADD queue, return rank
  private static final String LUA_RESERVE =
      "local stock = tonumber(redis.call('get', KEYS[1]) or '0'); " +
      "if stock <= 0 then return -1; end; " +
      "redis.call('decr', KEYS[1]); " +
      "redis.call('set', KEYS[2], '1', 'EX', ARGV[1]); " +
      "redis.call('zadd', KEYS[3], ARGV[2], ARGV[3]); " +
      "return redis.call('zrank', KEYS[3], ARGV[3]);";

  private final DefaultRedisScript<Long> script;
  private final DefaultRedisScript<Long> reserveScript;

  public RedisStockAdapter(StringRedisTemplate redis) {
    this.redis = redis;
    this.script = new DefaultRedisScript<>();
    this.script.setScriptText(LUA_DECR);
    this.script.setResultType(Long.class);
    this.reserveScript = new DefaultRedisScript<>();
    this.reserveScript.setScriptText(LUA_RESERVE);
    this.reserveScript.setResultType(Long.class);
  }

  private String key(Long campaignId) { return "smart.tobi.flash:stock:" + campaignId; }
  private String holdKey(Long campaignId, Long userId) { return "hold:" + campaignId + ":" + userId; }
  private String queueKey(Long campaignId) { return "queue:" + campaignId; }

  @Override
  public long tryDecrement(Long campaignId, int quantity) {
    Long res = redis.execute(script, List.of(key(campaignId)), String.valueOf(quantity));
    return res == null ? -1 : res;
  }

  @Override
  public long tryReserve(Long campaignId, Long userId, int holdDurationSeconds) {
    long ts = System.currentTimeMillis();
    Long rank = redis.execute(reserveScript,
        List.of(key(campaignId), holdKey(campaignId, userId), queueKey(campaignId)),
        String.valueOf(holdDurationSeconds), String.valueOf(ts), String.valueOf(userId));
    return rank == null ? -1 : rank;
  }

  @Override public void increment(Long campaignId, int quantity) {
    redis.opsForValue().increment(key(campaignId), quantity);
  }

  @Override public long getStock(Long campaignId) {
    String v = redis.opsForValue().get(key(campaignId));
    return v == null ? 0 : Long.parseLong(v);
  }

  @Override public void setStock(Long campaignId, int stock) {
    redis.opsForValue().set(key(campaignId), String.valueOf(stock));
  }
}
