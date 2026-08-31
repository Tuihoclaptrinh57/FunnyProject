package smart.tobi.flash.domain.port.in;

import smart.tobi.flash.domain.model.QueueTicket;
import java.util.Optional;

public interface GetQueuePositionUseCase {
  Optional<QueueTicket> get(String ticketId);
  long position(String ticketId);
}
