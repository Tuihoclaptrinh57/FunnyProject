package smart.tobi.common.adapter.in.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import smart.tobi.flash.domain.port.in.CreateCampaignUseCase;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(CreateCampaignUseCase.OverlappingCampaignException.class)
  public ResponseEntity<Map<String, String>> handleOverlap(CreateCampaignUseCase.OverlappingCampaignException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", ex.getMessage(), "code", "OVERLAP"));
  }

  @ExceptionHandler(CreateCampaignUseCase.InvalidTimeWindowException.class)
  public ResponseEntity<Map<String, String>> handleTime(CreateCampaignUseCase.InvalidTimeWindowException ex) {
    return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage(), "code", "INVALID_TIME"));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, String>> handleBad(IllegalArgumentException ex) {
    return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
  }
}
