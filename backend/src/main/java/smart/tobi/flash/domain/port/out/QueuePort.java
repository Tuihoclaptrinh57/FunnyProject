package smart.tobi.flash.domain.port.out;

import smart.tobi.flash.domain.model.QueueTicket;
import java.util.Optional;

/**
 * US-202 Output Port - Queue via Redis ZSet (priority = timestamp FIFO)
 * DSA: SortedSet + ZPOPMIN
 */
public interface QueuePort {
  QueueTicket enqueue(Long campaignId, Long userId, int quantity);
  Optional<QueueTicket> findTicket(String ticketId);
  long getPosition(String ticketId);
  Optional<QueueTicket> popNext(Long campaignId);
  long size(Long campaignId);
}
