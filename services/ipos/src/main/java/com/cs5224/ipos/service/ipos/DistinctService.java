package com.cs5224.ipos.service.ipos;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class DistinctService {

    private final MongoTemplate mongoIposTemplate;

    public DistinctService(@Qualifier("mongoIposDB") MongoTemplate mongoTemplate) {
        this.mongoIposTemplate = mongoTemplate;
    }
}
