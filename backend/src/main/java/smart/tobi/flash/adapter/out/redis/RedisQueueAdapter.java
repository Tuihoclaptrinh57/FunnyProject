package smart.tobi.flash.adapter.out.redis;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import smart.tobi.flash.domain.model.QueueTicket;
import smart.tobi.flash.domain.port.out.QueuePort;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * US-202 Adapter Out - Redis SortedSet FIFO Queue
 * DSA: ZADD score=timestamp, ZRANK for position, ZPOPMIN for calling next
 * Keys: smart.tobi.flash:queue:{campaignId} -> ZSet(ticketId -> score)
 *       smart.tobi.flash:queue:ticket:{ticketId} -> Hash
 */
@Component
public class RedisQueueAdapter implements QueuePort {

  private final StringRedisTemplate redis;

  public RedisQueueAdapter(StringRedisTemplate redis) {
    this.redis = redis;
  }

  private String queueKey(Long campaignId) { return "smart.tobi.flash:queue:" + campaignId; }
  private String ticketKey(String ticketId) { return "smart.tobi.flash:queue:ticket:" + ticketId; }

  @Override
  public QueueTicket enqueue(Long campaignId, Long userId, int quantity) {
    String ticketId = UUID.randomUUID().toString();
    long score = Instant.now().toEpochMilli();
    redis.opsForZSet().add(queueKey(campaignId), ticketId, score);
    long position = Optional.ofNullable(redis.opsForZSet().rank(queueKey(campaignId), ticketId)).orElse(0L);
    // store ticket hash with TTL 30m
    String tk = ticketKey(ticketId);
    redis.opsForHash().put(tk, "campaignId", campaignId.toString());
    redis.opsForHash().put(tk, "userId", userId.toString());
    redis.opsForHash().put(tk, "quantity", String.valueOf(quantity));
    redis.opsForHash().put(tk, "position", String.valueOf(position));
    redis.opsForHash().put(tk, "status", "WAITING");
    redis.opsForHash().put(tk, "createdAt", Instant.now().toString());
    redis.expire(tk, java.time.Duration.ofMinutes(30));
    return new QueueTicket(ticketId, campaignId, userId, quantity, position, QueueTicket.TicketStatus.WAITING, Instant.now());
  }

  @Override
  public Optional<QueueTicket> findTicket(String ticketId) {
    String tk = ticketKey(ticketId);
    var map = redis.opsForHash().entries(tk);
    if (map.isEmpty()) return Optional.empty();
    return Optional.of(new QueueTicket(
        ticketId,
        Long.valueOf((String) map.get("campaignId")),
        Long.valueOf((String) map.get("userId")),
        Integer.parseInt((String) map.get("quantity")),
        Long.parseLong((String) map.getOrDefault("position", "0")),
        QueueTicket.TicketStatus.valueOf((String) map.get("status")),
        Instant.parse((String) map.get("createdAt"))
    ));
  }

  @Override
  public long getPosition(String ticketId) {
    var ticket = findTicket(ticketId).orElse(null);
    if (ticket == null) return -1;
    Long rank = redis.opsForZSet().rank(queueKey(ticket.campaignId()), ticketId);
    return rank == null ? -1 : rank;
  }

  @Override
  public Optional<QueueTicket> popNext(Long campaignId) {
    var set = redis.opsForZSet().popMin(queueKey(campaignId));
    if (set == null || set.getValue() == null) return Optional.empty();
    return findTicket(set.getValue().toString());
  }

  @Override
  public long size(Long campaignId) {
    Long size = redis.opsForZSet().size(queueKey(campaignId));
    return size == null ? 0 : size;
  }
}
