package smart.tobi.logistics.adapter.in.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart.tobi.logistics.domain.model.ShipperLocation;
import smart.tobi.logistics.domain.port.in.TrackShipperUseCase;
import java.util.List;

@RestController @RequestMapping("/api/logistics")
public class LogisticsController {
  private final TrackShipperUseCase trackUseCase;
  public LogisticsController(TrackShipperUseCase trackUseCase){this.trackUseCase=trackUseCase;}

  @PostMapping("/shipper/{shipperId}/location")
  public ResponseEntity<Void> update(@PathVariable Long shipperId, @RequestParam double lat, @RequestParam double lng){
    trackUseCase.updateLocation(new ShipperLocation(shipperId, lat, lng));
    return ResponseEntity.ok().build();
  }

  @GetMapping("/shipper/nearby")
  public ResponseEntity<List<ShipperLocation>> nearby(@RequestParam double lat, @RequestParam double lng, @RequestParam(defaultValue="5") double radiusKm){
    return ResponseEntity.ok(trackUseCase.findNearest(lat, lng, radiusKm));
  }

  @GetMapping("/shipment/{orderId}")
  public ResponseEntity<?> shipment(@PathVariable Long orderId){
    // Listen to CheckoutCompletedEvent to create shipment - for demo return mock
    return ResponseEntity.ok(java.util.Map.of("orderId", orderId, "status", "SHIPPED", "shipperId", 1));
  }
}
