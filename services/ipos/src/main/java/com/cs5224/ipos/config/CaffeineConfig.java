package com.cs5224.ipos.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

import static com.cs5224.ipos.constants.CaffeineConstants.RateLimitingCache;

@Configuration
public class CaffeineConfig {

    @Value("${caffeine.maxWeight}")
    private long maximumWeight;


    @Bean
    public CacheManager cacheManager() {
        List<CaffeineCache> list = new ArrayList<>();
        list.add(new CaffeineCache(RateLimitingCache, Caffeine.newBuilder().maximumWeight(maximumWeight).weigher((k1, v1) -> 1).build()));
        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(list);
        return manager;
    }
}
