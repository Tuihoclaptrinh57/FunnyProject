package smart.tobi.shared.domain;

import java.time.Instant;

public record WalletDebitedEvent(UserId userId, Money amount, Instant occurredAt) implements DomainEvent {
  @Override public String topic() { return "wallet.debited"; }
}
