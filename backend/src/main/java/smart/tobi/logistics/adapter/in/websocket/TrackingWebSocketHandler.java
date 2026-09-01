package smart.tobi.logistics.adapter.in.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.util.concurrent.ConcurrentHashMap;

/**
 * M4 Logistics - Reuse WS infra from M2 Live
 * Clients subscribe to tracking:{orderId}, shipper location pushed via Redis Pub/Sub
 */
@Component
public class TrackingWebSocketHandler extends TextWebSocketHandler {
  private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
  @Override public void afterConnectionEstablished(WebSocketSession session){ sessions.put(session.getId(), session); }
  @Override public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status){ sessions.remove(session.getId()); }
  @Override protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    for (var s : sessions.values()) if (s.isOpen()) s.sendMessage(message);
  }
}
