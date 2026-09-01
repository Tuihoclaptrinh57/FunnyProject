package smart.tobi.feed.adapter.out.search;

import org.springframework.stereotype.Component;
import smart.tobi.feed.domain.port.out.VectorSearchPort;
import java.util.List;

/**
 * M3 Feed - Vector search via pgvector or Qdrant
 * For demo: mock - in prod use pgvector extension or Qdrant client
 */
@Component
public class PgVectorAdapter implements VectorSearchPort {
  @Override public List<Long> recommend(String query, int limit){
    // Mock: return dealIds based on vector similarity
    return List.of(1L, 2L, 3L).subList(0, Math.min(limit, 3));
  }
}
