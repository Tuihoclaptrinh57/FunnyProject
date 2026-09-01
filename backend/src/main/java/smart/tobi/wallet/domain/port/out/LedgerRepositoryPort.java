package smart.tobi.wallet.domain.port.out;

import smart.tobi.wallet.domain.model.Ledger;

public interface LedgerRepositoryPort {
  Ledger save(Ledger ledger);
}
