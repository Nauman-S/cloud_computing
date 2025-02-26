package com.cs5224.ipos.service.ipos;

import com.cs5224.ipos.domain.DistinctStatusCount;
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
                break;
            case "country":
                aggregation = getCountByArrayField("applicant","countryOfIncorporationOrResidence.description");
                break;
            case "year":
                aggregation = getCountByYear("summary.filingDate");
                break;

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

    public Aggregation getCountByYear(String dateField) {
        MatchOperation matchValidDates = Aggregation.match(
                Criteria.where(dateField).regex("^\\d{4}-\\d{2}-\\d{2}$")
        );

        ProjectionOperation projectionOperation = Aggregation.project()
                .andExpression("year(dateFromString($" + dateField + "))").as("year");
        GroupOperation groupByField = Aggregation.group("year").count().as("count");

        return Aggregation.newAggregation(matchValidDates, projectionOperation, groupByField);
    }
}
