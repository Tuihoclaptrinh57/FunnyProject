# ADR-003: Bot Protection for Flash Sale

Date: 2026-09-01

## Problem
Flash sale is most exploited point: 1 IP creates hundreds of accounts to join queue in bulk.

## Solution (minimal for demo, expand later)
- **Before JoinQueueUseCase**: Require captcha at first join (hCaptcha) or check abnormal behavior (1 IP -> 100 accounts -> block)
- Not detailed in demo scope, but must have 1 line in "if had more time" - interviewers at scale always ask about abuse prevention

## Implementation (future)
- Adapter-in-web: Check `X-Forwarded-For` IP, Redis `INCR ip:{ip}:join:count` with TTL 60s, if >10 block 429
- Or: Frontend shows captcha, backend verifies `captchaToken` via `CaptchaVerifierPort` before calling `JoinQueueUseCase`
