package smart.tobi.feed.domain.port.in;

import java.util.List;

public interface RecommendProductUseCase {
  List<Long> recommend(Long userId, String query, int limit);
}
