package smart.tobi.logistics.adapter.in.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration @EnableWebSocket
public class LogisticsWebSocketConfig implements WebSocketConfigurer {
  private final TrackingWebSocketHandler handler;
  public LogisticsWebSocketConfig(TrackingWebSocketHandler handler){this.handler=handler;}
  @Override public void registerWebSocketHandlers(WebSocketHandlerRegistry registry){
    registry.addHandler(handler, "/ws/tracking/{orderId}").setAllowedOrigins("*");
  }
}
