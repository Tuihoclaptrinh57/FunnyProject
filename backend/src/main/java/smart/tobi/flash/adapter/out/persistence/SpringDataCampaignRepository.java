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

  // US-204: Optimistic lock via version + check stock_remaining >= quantity
  @org.springframework.data.jpa.repository.Modifying
  @Query("""
      UPDATE CampaignJpaEntity c
      SET c.stockRemaining = c.stockRemaining - :qty, c.version = c.version + 1
      WHERE c.id = :id AND c.stockRemaining >= :qty
      """)
  int decrementStock(@Param("id") Long id, @Param("qty") int qty);
}
