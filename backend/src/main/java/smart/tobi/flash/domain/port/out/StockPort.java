package smart.tobi.flash.domain.port.out;

/**
 * Output Port - abstract Redis/DB away. DSA: Lua atomic decr.
 */
public interface StockPort {

  /**
   * Atomically try to decrement stock. Returns remaining or -1 if insufficient.
   * Implemented via Redis Lua: if stock >= qty then decr else -1
   */
  long tryDecrement(Long campaignId, int quantity);

  /**
   * Deep-dive M1: 5-step atomic Lua - check stock, decr, set hold with TTL, ZADD queue, return position
   * @return queue position (0-based) if success, -1 if out_of_stock
   */
  long tryReserve(Long campaignId, Long userId, int holdDurationSeconds);

  void increment(Long campaignId, int quantity);

  long getStock(Long campaignId);

  void setStock(Long campaignId, int stock);
}
