package smart.tobi.flash.application.usecase;

import org.springframework.stereotype.Service;
import smart.tobi.flash.domain.model.QueueTicket;
import smart.tobi.flash.domain.port.in.GetQueuePositionUseCase;
import smart.tobi.flash.domain.port.out.QueuePort;

import java.util.Optional;

@Service
public class GetQueuePositionService implements GetQueuePositionUseCase {
  private final QueuePort queuePort;
  public GetQueuePositionService(QueuePort queuePort) { this.queuePort = queuePort; }

  @Override public Optional<QueueTicket> get(String ticketId) { return queuePort.findTicket(ticketId); }
  @Override public long position(String ticketId) { return queuePort.getPosition(ticketId); }
}
