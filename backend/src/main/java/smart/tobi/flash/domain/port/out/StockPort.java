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

  void increment(Long campaignId, int quantity);

  long getStock(Long campaignId);

  void setStock(Long campaignId, int stock);
}
