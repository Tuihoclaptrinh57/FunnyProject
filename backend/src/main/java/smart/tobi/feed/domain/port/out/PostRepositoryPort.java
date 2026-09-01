package smart.tobi.feed.domain.port.out;

import smart.tobi.feed.domain.model.Post;
import java.util.List;

public interface PostRepositoryPort {
  List<Post> findAll();
  Post save(Post post);
}
