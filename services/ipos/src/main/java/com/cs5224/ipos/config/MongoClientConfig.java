package com.cs5224.ipos.config;

import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoClientConfig {
    @Value("${spring.data.mongodb.uri.base}")
    String mongoUri;

    public @Bean com.mongodb.client.MongoClient mongoClient() {
        return MongoClients.create(mongoUri);
    }
}
