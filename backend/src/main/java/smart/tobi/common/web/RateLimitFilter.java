package smart.tobi.common.web;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * 4. Rate limit at API Gateway / adapter-in-web
 * Per userId (prevent bot spamming join) and per dealId (protect Redis/Lua throughput)
 * Placed at gateway/filter, not in use case - domain unaware of req/s
 * Simple token bucket: 5 req/s per user, 1000 req/s per deal
 */
@Component
public class RateLimitFilter implements Filter {
  private final ConcurrentHashMap<String, AtomicInteger> userBuckets = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<String, AtomicInteger> dealBuckets = new ConcurrentHashMap<>();

  public RateLimitFilter(){
    Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(() -> { userBuckets.clear(); dealBuckets.clear(); }, 1, 1, TimeUnit.SECONDS);
  }

  @Override public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
    var httpReq = (HttpServletRequest) req;
    if (httpReq.getRequestURI().contains("/api/flash")) {
      String userId = httpReq.getHeader("X-User-Id");
      if (userId != null) {
        int count = userBuckets.computeIfAbsent(userId, k -> new AtomicInteger(0)).incrementAndGet();
        if (count > 5) { ((HttpServletResponse)res).sendError(429, "Too many requests per user"); return; }
      }
      String dealId = httpReq.getParameter("dealId");
      if (dealId != null) {
        int count = dealBuckets.computeIfAbsent(dealId, k -> new AtomicInteger(0)).incrementAndGet();
        if (count > 1000) { ((HttpServletResponse)res).sendError(429, "Deal too hot"); return; }
      }
    }
    chain.doFilter(req, res);
  }
}
