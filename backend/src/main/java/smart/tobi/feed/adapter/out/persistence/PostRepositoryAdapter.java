package smart.tobi.feed.adapter.out.persistence;

import org.springframework.stereotype.Component;
import smart.tobi.feed.domain.model.Post;
import smart.tobi.feed.domain.port.out.PostRepositoryPort;
import java.util.List;

@Component
public class PostRepositoryAdapter implements PostRepositoryPort {
  private final SpringDataPostRepository jpa;
  public PostRepositoryAdapter(SpringDataPostRepository jpa){this.jpa=jpa;}
  private Post toDomain(PostJpaEntity e){ return new Post(e.getId(), e.getAuthorId(), e.getContent(), e.getDealId(), e.getCreatedAt()); }
  private PostJpaEntity toEntity(Post d){ var e=new PostJpaEntity(); e.setId(d.id()); e.setAuthorId(d.authorId()); e.setContent(d.content()); e.setDealId(d.dealId()); e.setCreatedAt(d.createdAt()); return e; }
  @Override public List<Post> findAll(){ return jpa.findAll().stream().map(this::toDomain).toList(); }
  @Override public Post save(Post post){ return toDomain(jpa.save(toEntity(post))); }
}
