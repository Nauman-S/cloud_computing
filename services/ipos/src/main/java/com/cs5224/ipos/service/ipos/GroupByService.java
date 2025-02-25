package com.cs5224.ipos.service.ipos;

import com.cs5224.ipos.domain.DistinctStatusCount;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.stereotype.Service;

import static com.cs5224.ipos.constants.MongoConstants.PATENT_COLLECTION;

@Service
public class GroupByService {
    private final MongoTemplate mongoIposTemplate;

    public GroupByService(@Qualifier("mongoIposDB") MongoTemplate mongoTemplate) {
        this.mongoIposTemplate = mongoTemplate;
    }
    public AggregationResults<DistinctStatusCount> getCountDistinctApplicationStatus() {
        GroupOperation groupByField = Aggregation.group("summary.applicationStatus").count().as("count");

        Aggregation aggregation = Aggregation.newAggregation(groupByField);
        return mongoIposTemplate.aggregate(aggregation, PATENT_COLLECTION, DistinctStatusCount.class);
    }
}
