package smart.tobi.feed.application;

import org.springframework.stereotype.Service;
import smart.tobi.feed.domain.model.FeedEntry;
import smart.tobi.feed.domain.model.Post;
import smart.tobi.feed.domain.port.in.RankFeedUseCase;
import smart.tobi.feed.domain.port.out.PostRepositoryPort;

import java.util.*;

@Service
public class RankFeedService implements RankFeedUseCase {
  private final PostRepositoryPort postRepo;
  public RankFeedService(PostRepositoryPort postRepo){this.postRepo=postRepo;}

  @Override public List<FeedEntry> rank(Long userId, int limit){
    var posts = postRepo.findAll();
    // Top-K heap (priority queue) by score = engagement + freshness
    var heap = new PriorityQueue<FeedEntry>(Comparator.comparingDouble(FeedEntry::score));
    for (var p : posts){
      double score = Math.random() * 100; // mock: engagement + vector similarity
      var entry = new FeedEntry(p, score, score > 50 ? "Vector similarity 0.92" : "Engagement 1.2k");
      heap.offer(entry);
      if (heap.size() > limit) heap.poll();
    }
    var result = new ArrayList<>(heap);
    result.sort(Comparator.comparingDouble(FeedEntry::score).reversed());
    return result;
  }
}
