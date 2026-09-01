package smart.tobi.feed.adapter.in.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart.tobi.feed.domain.port.in.RankFeedUseCase;
import smart.tobi.feed.domain.port.in.RecommendProductUseCase;

@RestController @RequestMapping("/api/feed")
public class FeedController {
  private final RankFeedUseCase rankUseCase;
  private final RecommendProductUseCase recommendUseCase;
  public FeedController(RankFeedUseCase rankUseCase, RecommendProductUseCase recommendUseCase){this.rankUseCase=rankUseCase; this.recommendUseCase=recommendUseCase;}

  @GetMapping
  public ResponseEntity<?> feed(@RequestParam(defaultValue="1") Long userId, @RequestParam(defaultValue="10") int limit){
    return ResponseEntity.ok(rankUseCase.rank(userId, limit));
  }

  @GetMapping("/recommend")
  public ResponseEntity<?> recommend(@RequestParam String query, @RequestParam(defaultValue="3") int limit){
    return ResponseEntity.ok(recommendUseCase.recommend(null, query, limit));
  }
}
