package smart.tobi.live.adapter.in.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.util.concurrent.ConcurrentHashMap;

/**
 * M2 Live - WebSocket fan-out (STOMP or raw WS + Redis Pub/Sub)
 * For demo: in-memory broadcast, later replace with Redis Pub/Sub
 * Clients subscribe to live:{sessionId}, viewer count via Redis ZSET
 */
@Component
public class LiveWebSocketHandler extends TextWebSocketHandler {
  private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

  @Override public void afterConnectionEstablished(WebSocketSession session) { sessions.put(session.getId(), session); }
  @Override public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) { sessions.remove(session.getId()); }

  @Override protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    // Broadcast to all (fan-out) - later use Redis Pub/Sub: redis.publish("live:"+sessionId, message)
    for (var s : sessions.values()) if (s.isOpen()) s.sendMessage(message);
  }

  public int viewerCount() { return sessions.size(); }
}
