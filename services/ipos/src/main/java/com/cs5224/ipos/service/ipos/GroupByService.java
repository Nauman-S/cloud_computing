package com.cs5224.ipos.service.ipos;

import com.cs5224.ipos.domain.DistinctStatusCount;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import static com.cs5224.ipos.constants.MongoConstants.PATENT_COLLECTION;

@Service
public class GroupByService {
    private final MongoTemplate mongoIposTemplate;

    public GroupByService(@Qualifier("mongoIposDB") MongoTemplate mongoTemplate) {
        this.mongoIposTemplate = mongoTemplate;
    }
    public AggregationResults<DistinctStatusCount> getCount(String fieldName) {
        MatchOperation matchOperation = Aggregation.match(Criteria.where(fieldName).exists(true));
        Aggregation aggregation = null;
        switch (fieldName) {
            case "status":
                aggregation = getBasicCount("summary.applicationStatus");
                break;
            case "applicantName":
                aggregation = getCountByArrayField("applicant", "name");

        }
        if (aggregation != null) {
            AggregationResults<DistinctStatusCount>  result = mongoIposTemplate.aggregate(aggregation, PATENT_COLLECTION, DistinctStatusCount.class);
            if (!result.getMappedResults().isEmpty()) {
                return result;
            }
        }

        return null;
    }

    public Aggregation getBasicCount(String aggField) {
        GroupOperation groupByField = Aggregation.group(aggField).count().as("count");
        Aggregation aggregation = Aggregation.newAggregation(groupByField);
        return aggregation;
    }

    public Aggregation getCountByArrayField(String arrayField, String groupByField) {
        UnwindOperation unwind = Aggregation.unwind(arrayField);
        GroupOperation group = Aggregation.group(arrayField + "." + groupByField).count().as("count");
        return Aggregation.newAggregation(unwind, group);
    }
}
