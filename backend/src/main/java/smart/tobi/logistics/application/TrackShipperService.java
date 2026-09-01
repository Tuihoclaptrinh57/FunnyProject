package smart.tobi.logistics.application;

import org.springframework.stereotype.Service;
import smart.tobi.logistics.domain.model.ShipperLocation;
import smart.tobi.logistics.domain.port.in.TrackShipperUseCase;
import smart.tobi.logistics.domain.port.out.GeoSearchPort;
import java.util.List;

@Service
public class TrackShipperService implements TrackShipperUseCase {
  private final GeoSearchPort geoPort;
  public TrackShipperService(GeoSearchPort geoPort){this.geoPort=geoPort;}
  @Override public List<ShipperLocation> findNearest(double lat, double lng, double radiusKm){ return geoPort.nearby(lat, lng, radiusKm); }
  @Override public void updateLocation(ShipperLocation loc){ geoPort.addLocation(loc); }
}
