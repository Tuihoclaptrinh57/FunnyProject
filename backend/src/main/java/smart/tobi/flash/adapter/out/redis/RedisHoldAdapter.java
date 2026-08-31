package smart.tobi.flash.adapter.out.redis;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import smart.tobi.flash.adapter.out.persistence.SpringDataHoldRepository;
import smart.tobi.flash.adapter.out.persistence.StockHoldJpaEntity;
import smart.tobi.flash.domain.model.StockHold;
import smart.tobi.flash.domain.port.out.HoldPort;
import smart.tobi.flash.domain.port.out.StockPort;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

/**
 * US-203 Adapter Out - Hold with Redis TTL 600s + DB
 * Key: smart.tobi.flash:hold:{holdId} -> Hash TTL 600s
 * On expire: StockPort.increment + DB status EXPIRED (via scheduled job or Redis keyspace notification)
 */
@Component
public class RedisHoldAdapter implements HoldPort {

  private final StringRedisTemplate redis;
  private final SpringDataHoldRepository jpa;
  private final StockPort stockPort;

  public RedisHoldAdapter(StringRedisTemplate redis, SpringDataHoldRepository jpa, StockPort stockPort) {
    this.redis = redis; this.jpa = jpa; this.stockPort = stockPort;
  }

  private String key(String holdId) { return "smart.tobi.flash:hold:" + holdId; }

  @Override
  public StockHold create(StockHold hold) {
    // Redis TTL 600s
    String k = key(hold.id());
    redis.opsForHash().put(k, "campaignId", hold.campaignId().toString());
    redis.opsForHash().put(k, "userId", hold.userId().toString());
    redis.opsForHash().put(k, "quantity", String.valueOf(hold.quantity()));
    redis.opsForHash().put(k, "expiresAt", hold.expiresAt().toString());
    redis.opsForHash().put(k, "status", hold.status().name());
    redis.expire(k, Duration.ofSeconds(600));
    // DB persist
    var e = new StockHoldJpaEntity();
    e.setId(hold.id()); e.setCampaignId(hold.campaignId()); e.setUserId(hold.userId());
    e.setQuantity(hold.quantity()); e.setExpiresAt(hold.expiresAt()); e.setStatus(hold.status().name()); e.setCreatedAt(hold.createdAt());
    jpa.save(e);
    return hold;
  }

  @Override public Optional<StockHold> findById(String holdId) {
    var e = jpa.findById(holdId);
    return e.map(ent -> new StockHold(ent.getId(), ent.getCampaignId(), ent.getUserId(), ent.getQuantity(), ent.getExpiresAt(), StockHold.HoldStatus.valueOf(ent.getStatus()), ent.getCreatedAt()));
  }

  @Override
  public void expire(String holdId) {
    var hold = findById(holdId).orElse(null);
    if (hold == null || hold.status() != StockHold.HoldStatus.ACTIVE) return;
    // release stock
    stockPort.increment(hold.campaignId(), hold.quantity());
    // update DB
    var e = jpa.findById(holdId).orElse(null);
    if (e != null) { e.setStatus(StockHold.HoldStatus.EXPIRED.name()); jpa.save(e); }
    redis.delete(key(holdId));
  }

  @Override
  public void confirm(String holdId) {
    var e = jpa.findById(holdId).orElse(null);
    if (e != null) { e.setStatus(StockHold.HoldStatus.CONFIRMED.name()); jpa.save(e); }
    redis.delete(key(holdId));
  }
}
