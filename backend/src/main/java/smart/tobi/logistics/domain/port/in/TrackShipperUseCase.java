package smart.tobi.logistics.domain.port.in;

import smart.tobi.logistics.domain.model.ShipperLocation;
import java.util.List;

public interface TrackShipperUseCase {
  List<ShipperLocation> findNearest(double lat, double lng, double radiusKm);
  void updateLocation(ShipperLocation loc);
}
