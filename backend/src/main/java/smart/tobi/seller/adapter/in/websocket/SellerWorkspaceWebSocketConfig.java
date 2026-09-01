package smart.tobi.seller.adapter.in.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration @EnableWebSocket
public class SellerWorkspaceWebSocketConfig implements WebSocketConfigurer {
  private final SellerWorkspaceWebSocketHandler handler;
  public SellerWorkspaceWebSocketConfig(SellerWorkspaceWebSocketHandler handler){this.handler=handler;}
  @Override public void registerWebSocketHandlers(WebSocketHandlerRegistry registry){
    registry.addHandler(handler, "/ws/seller/{draftId}").setAllowedOrigins("*");
  }
}
