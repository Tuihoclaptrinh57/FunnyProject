package smart.tobi.common.idempotency;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Optional;

/**
 * 1. Idempotency - client gửi Idempotency-Key (UUID), server lưu Redis TTL vài phút kèm kết quả
 * Áp dụng cho JoinQueueUseCase và CheckoutUseCase (tiền/hàng)
 */
@Component
public class IdempotencyStore {
  private final StringRedisTemplate redis;
  public IdempotencyStore(StringRedisTemplate redis){this.redis=redis;}

  private String key(String idempotencyKey){ return "idempotency:" + idempotencyKey; }

  public Optional<String> get(String idempotencyKey){
    if (idempotencyKey == null) return Optional.empty();
    String v = redis.opsForValue().get(key(idempotencyKey));
    return Optional.ofNullable(v);
  }

  public void put(String idempotencyKey, String resultJson){
    if (idempotencyKey == null) return;
    redis.opsForValue().set(key(idempotencyKey), resultJson, Duration.ofMinutes(10));
  }

  public boolean exists(String idempotencyKey){
    if (idempotencyKey == null) return false;
    Boolean has = redis.hasKey(key(idempotencyKey));
    return Boolean.TRUE.equals(has);
  }
}
