package smart.tobi.live.adapter.in.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart.tobi.live.domain.port.in.PinDealUseCase;
import smart.tobi.live.domain.port.in.StartLiveUseCase;

@RestController @RequestMapping("/api/live")
public class LiveController {
  private final StartLiveUseCase startLive;
  private final PinDealUseCase pinDeal;
  public LiveController(StartLiveUseCase startLive, PinDealUseCase pinDeal){this.startLive=startLive; this.pinDeal=pinDeal;}

  public record StartRequest(String title, Long sellerId){}
  public record PinRequest(Long dealId){}

  @PostMapping("/sessions")
  public ResponseEntity<?> start(@RequestBody StartRequest req){
    var session = startLive.start(new StartLiveUseCase.Command(req.title(), req.sellerId()));
    return ResponseEntity.ok(session);
  }

  @PostMapping("/sessions/{sessionId}/pin")
  public ResponseEntity<?> pin(@PathVariable Long sessionId, @RequestBody PinRequest req){
    var pinned = pinDeal.pin(new PinDealUseCase.Command(sessionId, req.dealId()));
    // TODO: publish to Redis Pub/Sub for fan-out: live:{sessionId}
    return ResponseEntity.ok(pinned);
  }

  @GetMapping("/sessions/{id}")
  public ResponseEntity<?> get(@PathVariable Long id){
    return ResponseEntity.ok(java.util.Map.of("id", id, "status", "LIVE", "viewerCount", 12482));
  }
}
