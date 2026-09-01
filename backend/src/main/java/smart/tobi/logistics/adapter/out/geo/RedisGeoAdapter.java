package smart.tobi.logistics.adapter.out.geo;

import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import smart.tobi.logistics.domain.model.ShipperLocation;
import smart.tobi.logistics.domain.port.out.GeoSearchPort;
import java.util.List;

@Component
public class RedisGeoAdapter implements GeoSearchPort {
  private final StringRedisTemplate redis;
  private static final String KEY = "smart.tobi.logistics:geo:shipper";
  public RedisGeoAdapter(StringRedisTemplate redis){this.redis=redis;}

  @Override public void addLocation(ShipperLocation loc){
    redis.opsForGeo().add(KEY, new Point(loc.lng(), loc.lat()), loc.shipperId().toString());
  }
  @Override public List<ShipperLocation> nearby(double lat, double lng, double radiusKm){
    var results = redis.opsForGeo().radius(KEY, new org.springframework.data.geo.Circle(new Point(lng, lat), new org.springframework.data.geo.Distance(radiusKm, RedisGeoCommands.DistanceUnit.KILOMETERS)));
    if (results == null) return List.of();
    return results.getContent().stream().map(r -> new ShipperLocation(Long.valueOf(r.getContent().getName()), r.getContent().getPoint().getY(), r.getContent().getPoint().getX())).toList();
  }
}
