package smart.tobi.wallet.adapter.out.persistence;

import org.springframework.stereotype.Component;
import smart.tobi.wallet.domain.model.Ledger;
import smart.tobi.wallet.domain.port.out.LedgerRepositoryPort;

@Component
public class LedgerRepositoryAdapter implements LedgerRepositoryPort {
  private final SpringDataLedgerRepository jpa;
  public LedgerRepositoryAdapter(SpringDataLedgerRepository jpa){this.jpa=jpa;}
  @Override public Ledger save(Ledger ledger){
    var e = new LedgerJpaEntity();
    e.setWalletId(ledger.walletId()); e.setUserId(ledger.userId().value()); e.setAmount(ledger.amount().amount());
    e.setCurrency(ledger.amount().currency()); e.setType(ledger.type()); e.setRefId(ledger.refId()); e.setCreatedAt(ledger.createdAt());
    var saved = jpa.save(e);
    return new Ledger(saved.getId(), saved.getWalletId(), ledger.userId(), ledger.amount(), saved.getType(), saved.getRefId(), saved.getCreatedAt());
  }
}
