package smart.tobi.feed.domain.port.in;

import smart.tobi.feed.domain.model.FeedEntry;
import java.util.List;

public interface RankFeedUseCase {
  List<FeedEntry> rank(Long userId, int limit);
}
