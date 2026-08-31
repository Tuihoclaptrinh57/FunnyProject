package smart.tobi.flash.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface SpringDataCampaignRepository extends JpaRepository<CampaignJpaEntity, Long> {

  // DSA: Interval overlapping check - (start < :end AND :start < end)
  @Query("""
      SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
      FROM CampaignJpaEntity c
      WHERE c.productId = :productId
        AND c.status <> 'CANCELLED'
        AND c.startAt < :endAt
        AND :startAt < c.endAt
      """)
  boolean existsOverlapping(@Param("productId") Long productId,
                            @Param("startAt") Instant startAt,
                            @Param("endAt") Instant endAt);
}
