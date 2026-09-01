package smart.tobi.seller.adapter.in.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.util.concurrent.ConcurrentHashMap;

/**
 * M5 Seller - CRDT sync endpoint (Yjs backend or Automerge)
 * For demo: broadcast yjs update to all peers in same doc, later use Hocuspocus
 */
@Component
public class SellerWorkspaceWebSocketHandler extends TextWebSocketHandler {
  private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
  @Override public void afterConnectionEstablished(WebSocketSession session){ sessions.put(session.getId(), session); }
  @Override public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status){ sessions.remove(session.getId()); }
  @Override protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    for (var s : sessions.values()) if (s.isOpen() && !s.getId().equals(session.getId())) s.sendMessage(message);
  }
}
