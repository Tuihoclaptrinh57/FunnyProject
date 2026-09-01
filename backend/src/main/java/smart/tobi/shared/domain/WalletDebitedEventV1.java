package smart.tobi.shared.domain;

import java.time.Instant;

public record WalletDebitedEventV1(UserId userId, Money amount, Instant occurredAt) implements DomainEvent {
  @Override public String topic() { return "wallet.debited"; }
}

