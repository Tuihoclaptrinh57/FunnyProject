package smart.tobi.common.metrics;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 5. Observability minimal for demo - 3 metrics to brag in interview
 * - Join Queue RPS at peak
 * - Lua script p99 latency
 * - WebSocket connections on Live
 * Exposed via /metrics or /actuator/prometheus, no need for full Grafana
 */
@Component
public class MetricsService {
  private final MeterRegistry registry;
  private final AtomicInteger wsConnections = new AtomicInteger(0);
  public MetricsService(MeterRegistry registry){this.registry=registry;}

  public void incrementJoinQueue(){ registry.counter("join_queue_rps").increment(); }
  public Timer.Sample startLuaTimer(){ return Timer.start(registry); }
  public void stopLuaTimer(Timer.Sample sample){ sample.stop(registry.timer("lua_p99")); }
  public void wsConnected(){ wsConnections.incrementAndGet(); registry.gauge("ws_connections", wsConnections); }
  public void wsDisconnected(){ wsConnections.decrementAndGet(); }

  @RestController
  static class MetricsController {
    private final MetricsService metrics;
    private final MeterRegistry registry;
    public MetricsController(MetricsService metrics, MeterRegistry registry){this.metrics=metrics; this.registry=registry;}
    @GetMapping("/metrics/demo")
    public Map<String, Object> demo(){
      return Map.of(
        "join_queue_rps", registry.counter("join_queue_rps").count(),
        "lua_p99_ms", registry.timer("lua_p99").max(java.util.concurrent.TimeUnit.MILLISECONDS),
        "ws_connections", metrics.wsConnections.get()
      );
    }
  }
}
