package com.cs5224.ipos.domain;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;

import static com.cs5224.ipos.constants.constant.SINGAPORE;
import static com.cs5224.ipos.service.rateLimiting.RateLimitingService.capacity;

@Data
@Getter
@Setter
public class UserIdentifier {
    String country;
    String uniqueIdentifier;

    public boolean makeVerbose() {
        return this.isPrivilegedUser();
    }

    public boolean isPrivilegedUser() {
        if (this.country.equals(SINGAPORE)) {
            return true;
        }
        return false;
    }

    public Bucket resolveBucket() {
        int cap = 1;
        if (isPrivilegedUser()) {
            cap = capacity;
        }
        return Bucket.builder().addLimit(Bandwidth.classic(cap, Refill.intervally(cap, Duration.ofMinutes(1)))).build();
    }
}
