package smart.tobi.feed.domain.port.out;

import java.util.List;

public interface VectorSearchPort {
  List<Long> recommend(String query, int limit);
}
