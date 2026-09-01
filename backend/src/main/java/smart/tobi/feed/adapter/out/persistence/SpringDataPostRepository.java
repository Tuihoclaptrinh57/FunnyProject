package smart.tobi.feed.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataPostRepository extends JpaRepository<PostJpaEntity, Long> {
}
