package com.cs5224.ipos.config;

import com.cs5224.ipos.constants.MongoConstants;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(
        basePackages = "com.cs5224.ipos.dao.patent",
        mongoTemplateRef = "mongoIposDB"
)
public class MongoIposConfig {

    @Bean(name = "mongoIposDB")
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        return new MongoTemplate(mongoClient, MongoConstants.IPOS_DATABASE);
    }
}
