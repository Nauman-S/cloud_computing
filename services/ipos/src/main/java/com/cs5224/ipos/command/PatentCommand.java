package com.cs5224.ipos.command;

import com.cs5224.ipos.dao.patent.PatentRepository;
import com.cs5224.ipos.domain.DistinctStatusCount;
import com.cs5224.ipos.model.documents.Patent;
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
public class PatentCommand {
    @Autowired
    PatentRepository patentRepository;

    @Autowired
    GroupByService groupByService;

    public ResponseEntity<?> execute(String applicationNumber, String groupByField, String aggregate) {

        if (groupByField == null || aggregate == null) {
            List<Patent>  patentList = patentRepository.findByApplicationNum(applicationNumber);

            if (patentList.size() > 0 ) {
                log.error("More than 1 Application exists for application number: {}", applicationNumber);
            } else if (patentList.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(patentList.get(0));
        } else {
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
