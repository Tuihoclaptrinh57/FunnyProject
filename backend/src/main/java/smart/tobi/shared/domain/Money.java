package smart.tobi.shared.domain;

import java.math.BigDecimal;

public record Money(BigDecimal amount, String currency) {
  public static Money vnd(long amount) { return new Money(BigDecimal.valueOf(amount), "VND"); }
  public Money add(Money other) { return new Money(this.amount.add(other.amount), this.currency); }
}
