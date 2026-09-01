package smart.tobi.wallet.adapter.out.persistence;

import org.springframework.stereotype.Component;
import smart.tobi.shared.domain.Money;
import smart.tobi.shared.domain.UserId;
import smart.tobi.wallet.domain.model.Wallet;
import smart.tobi.wallet.domain.port.out.WalletRepositoryPort;
import java.time.Instant;
import java.util.Optional;

@Component
public class WalletRepositoryAdapter implements WalletRepositoryPort {
  private final SpringDataWalletRepository jpa;
  public WalletRepositoryAdapter(SpringDataWalletRepository jpa){this.jpa=jpa;}

  private Wallet toDomain(WalletJpaEntity e){
    return new Wallet(e.getId(), UserId.of(e.getUserId()), new Money(e.getBalance(), e.getCurrency()));
  }
  private WalletJpaEntity toEntity(Wallet d){
    var e = new WalletJpaEntity();
    e.setId(d.id()); e.setUserId(d.userId().value()); e.setBalance(d.balance().amount()); e.setCurrency(d.balance().currency());
    e.setCreatedAt(Instant.now()); e.setUpdatedAt(Instant.now());
    return e;
  }

  @Override public Optional<Wallet> findByUserId(UserId userId){ return jpa.findByUserId(userId.value()).map(this::toDomain); }
  @Override public Wallet save(Wallet wallet){ return toDomain(jpa.save(toEntity(wallet))); }
  @Override public Wallet getOrCreate(UserId userId){
    return findByUserId(userId).orElseGet(() -> {
      var w = new Wallet(null, userId, Money.vnd(0));
      return save(w);
    });
  }
}
