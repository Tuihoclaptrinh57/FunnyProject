package smart.tobi.shared.domain;

public record UserId(Long value) {
  public static UserId of(Long v) { return new UserId(v); }
}
