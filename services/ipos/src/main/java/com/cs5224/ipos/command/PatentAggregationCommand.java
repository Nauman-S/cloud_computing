package com.cs5224.ipos.command;

import com.cs5224.ipos.domain.DistinctStatusCount;
import com.cs5224.ipos.service.ipos.GroupByService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class PatentAggregationCommand {

    @Autowired
    GroupByService groupByService;
    public ResponseEntity<?> execute(String groupByField, String aggregate) {

        if (groupByField != null && aggregate != null) {
            if (aggregate.equals("count")) {
                AggregationResults<DistinctStatusCount> aggregationResults = groupByService.getCount(groupByField);
                if (aggregationResults != null) {
                    List<DistinctStatusCount> list = aggregationResults.getMappedResults();
                    return ResponseEntity.ok(list);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
