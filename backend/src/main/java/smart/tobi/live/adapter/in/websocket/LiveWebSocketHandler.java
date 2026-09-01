package smart.tobi.live.adapter.in.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.util.concurrent.ConcurrentHashMap;

/**
 * M2 Deep-dive: 2-layer fan-out via Redis Pub/Sub
 * Client <--WS--> Gateway instance (any) --subscribe live:{sessionId}--> Redis Pub/Sub --publish--> All gateway instances --fan-out--> local WS sessions
 * Gateway stateless cross-instance - distribution in Redis, not in 1 instance memory
 * Thundering herd: 50k subscribers still cheap (O(subscribers) network, not compute), scale gateway by connection count
 * Reconnect: client calls GET /live/{sessionId}/snapshot after WS reconnect to avoid miss
 */
@Component
public class LiveWebSocketHandler extends TextWebSocketHandler {
  private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
  private final org.springframework.data.redis.core.StringRedisTemplate redis;
  public LiveWebSocketHandler(org.springframework.data.redis.core.StringRedisTemplate redis){this.redis=redis;}

  @Override public void afterConnectionEstablished(WebSocketSession session) {
    sessions.put(session.getId(), session);
    // Subscribe Redis channel for sessionId (extract from URI /ws/live/{sessionId})
    String sessionId = extractSessionId(session);
    if (sessionId != null) {
      // In prod: redisMessageListenerContainer.addMessageListener((msg, pat) -> fanoutLocal(new String(msg.getBody())), new ChannelTopic("live:"+sessionId));
    }
  }
  @Override public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) { sessions.remove(session.getId()); }

  @Override protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    String sessionId = extractSessionId(session);
    if (sessionId != null) {
      // Publish to Redis Pub/Sub - all gateway instances subscribed will receive and fan-out locally
      redis.convertAndSend("live:" + sessionId, message.getPayload());
    }
    // Also fan-out locally for single-instance demo
    fanoutLocal(message.getPayload());
  }

  public void fanoutLocal(String payload) {
    var msg = new TextMessage(payload);
    for (var s : sessions.values()) if (s.isOpen()) try { s.sendMessage(msg); } catch (Exception ignored) {}
  }

  private String extractSessionId(WebSocketSession session) {
    try { String path = session.getUri().getPath(); return path.substring(path.lastIndexOf('/')+1); } catch (Exception e){return null;}
  }

  public int viewerCount() { return sessions.size(); }
}
