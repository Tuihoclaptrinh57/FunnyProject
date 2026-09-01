package smart.tobi.feed.application;

import org.springframework.stereotype.Service;
import smart.tobi.feed.domain.port.in.RecommendProductUseCase;
import smart.tobi.feed.domain.port.out.VectorSearchPort;
import java.util.List;

@Service
public class RecommendProductService implements RecommendProductUseCase {
  private final VectorSearchPort vectorPort;
  public RecommendProductService(VectorSearchPort vectorPort){this.vectorPort=vectorPort;}
  @Override public List<Long> recommend(Long userId, String query, int limit){ return vectorPort.recommend(query, limit); }
}
