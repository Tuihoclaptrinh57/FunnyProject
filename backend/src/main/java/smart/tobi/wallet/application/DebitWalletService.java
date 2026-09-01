package smart.tobi.wallet.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import smart.tobi.shared.domain.Money;
import smart.tobi.shared.eventbus.EventPublisherPort;
import smart.tobi.shared.domain.WalletDebitedEvent;
import smart.tobi.wallet.domain.model.Ledger;
import smart.tobi.wallet.domain.port.in.DebitWalletUseCase;
import smart.tobi.wallet.domain.port.out.LedgerRepositoryPort;
import smart.tobi.wallet.domain.port.out.WalletRepositoryPort;

import java.time.Instant;

@Service
public class DebitWalletService implements DebitWalletUseCase {
  private final WalletRepositoryPort walletRepo;
  private final LedgerRepositoryPort ledgerRepo;
  private final EventPublisherPort eventPublisher;

  public DebitWalletService(WalletRepositoryPort walletRepo, LedgerRepositoryPort ledgerRepo, EventPublisherPort eventPublisher) {
    this.walletRepo = walletRepo; this.ledgerRepo = ledgerRepo; this.eventPublisher = eventPublisher;
  }

  @Override @Transactional
  public Result debit(Command cmd) {
    var wallet = walletRepo.getOrCreate(cmd.userId());
    var newWallet = wallet.debit(cmd.amount());
    walletRepo.save(newWallet);
    ledgerRepo.save(Ledger.debit(wallet.id(), cmd.userId(), cmd.amount(), cmd.orderId()));
    eventPublisher.publish(new WalletDebitedEvent(cmd.userId(), cmd.amount(), Instant.now()));
    return new Result(newWallet.id(), newWallet.balance());
  }
}
