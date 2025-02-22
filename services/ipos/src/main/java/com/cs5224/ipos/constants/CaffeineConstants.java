package com.cs5224.ipos.constants;

public interface CaffeineConstants {
    String RateLimitingCache = "RATE-LIMIT-CACHE";
    String RETRY_AFTER_SECONDS = "X-Rate-Limit-Retry-After-Seconds";
    String RATE_LIMIT_REMAINING = "X-Rate-Limit-Remaining";
    long BILLION = 1_000_000_000L;
}
