package smart.tobi.flash.domain.port.out;

import smart.tobi.flash.domain.model.StockHold;
import java.util.Optional;

public interface HoldPort {
  StockHold create(StockHold hold);
  Optional<StockHold> findById(String holdId);
  void expire(String holdId);
  void confirm(String holdId);
}
