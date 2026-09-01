package smart.tobi.logistics.domain.port.out;

import smart.tobi.logistics.domain.model.ShipperLocation;
import java.util.List;

public interface GeoSearchPort {
  void addLocation(ShipperLocation loc);
  List<ShipperLocation> nearby(double lat, double lng, double radiusKm);
}
