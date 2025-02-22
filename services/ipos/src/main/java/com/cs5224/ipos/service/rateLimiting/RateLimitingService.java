package com.cs5224.ipos.service.rateLimiting;

import com.cs5224.ipos.domain.UserIdentifier;
import com.github.benmanes.caffeine.cache.Cache;
import io.github.bucket4j.Bucket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;


import static com.cs5224.ipos.constants.CaffeineConstants.RateLimitingCache;

@Service
public class RateLimitingService {
    @Autowired
    CacheManager manager;

    @Value("${rateLimiter.bandwidth}")
    public static int capacity;

    public Bucket resolveBucket(UserIdentifier uid) {
        Cache<String,Bucket> weightedCache = (Cache<String, Bucket>) manager.getCache(RateLimitingCache);
        Bucket b;
        if  ((b = weightedCache.getIfPresent(uid.getUniqueIdentifier())) == null)  {
            b = uid.resolveBucket();
            weightedCache.put(uid.getUniqueIdentifier(), b);
        }

        return b;
    }
}
