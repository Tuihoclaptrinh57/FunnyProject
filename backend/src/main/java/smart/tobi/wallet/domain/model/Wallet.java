package smart.tobi.wallet.domain.model;

import smart.tobi.shared.domain.Money;
import smart.tobi.shared.domain.UserId;

public record Wallet(Long id, UserId userId, Money balance) {
  public Wallet debit(Money amount) {
    if (balance.amount().compareTo(amount.amount()) < 0) throw new IllegalStateException("Insufficient balance");
    return new Wallet(id, userId, new Money(balance.amount().subtract(amount.amount()), balance.currency()));
  }
  public Wallet credit(Money amount) {
    return new Wallet(id, userId, new Money(balance.amount().add(amount.amount()), balance.currency()));
  }
}
