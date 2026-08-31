package smart.tobi.flash.domain.model;

import java.time.Instant;

/**
 * US-202: Queue Ticket - FIFO fair queue via Redis SortedSet (score=timestamp)
 */
public record QueueTicket(
    String id,
    Long campaignId,
    Long userId,
    int quantity,
    long position,
    TicketStatus status,
    Instant createdAt
) {
  public enum TicketStatus { WAITING, CALLED, EXPIRED, CANCELLED }
}
