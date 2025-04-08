package com.cs5224.ipos.controller;

import com.cs5224.ipos.command.PatentAggregationCommand;
import com.cs5224.ipos.command.PatentCommand;
import com.cs5224.ipos.command.PatentSearchCommand;
import com.cs5224.ipos.dto.EmbeddingSearchRequest;
import com.cs5224.ipos.dto.PatentSearchRequest; 
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/patent")
@RestController
@Slf4j
public class PatentController {

    @Autowired
    PatentCommand patentCommand;

    @Autowired
    PatentAggregationCommand patentAggregationCommand;

    @Autowired
    private PatentSearchCommand patentSearchCommand;

    @GetMapping
    public ResponseEntity<?> patentTemplateQuery(@RequestParam(required=false) String groupBy,
                                                   @RequestParam(required = false) String aggregate) {
        return patentAggregationCommand.execute(groupBy,aggregate);
    }
    @GetMapping("/{applicationNumber}")
    public ResponseEntity<?> patentQuery(
            @PathVariable String applicationNumber,
            Authentication authObject) {

        return patentCommand.execute(applicationNumber);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchPatents(
            @RequestParam(required = false) String applicationNum,
            // @RequestParam(required = false) String applicationType,
            @RequestParam(required = false) String applicationStatus,
            @RequestParam(required = false) String titleOfInvention,
            @RequestParam(required = false) String filingDateStart,
            @RequestParam(required = false) String filingDateEnd,
            @RequestParam(required = false) String lodgementDateStart,
            @RequestParam(required = false) String lodgementDateEnd
    ) {
        PatentSearchRequest searchRequest = new PatentSearchRequest();
        searchRequest.setApplicationNum(applicationNum);
        // searchRequest.setApplicationType(applicationType);
        searchRequest.setApplicationStatus(applicationStatus);
        searchRequest.setTitleOfInvention(titleOfInvention);
        searchRequest.setFilingDateStart(filingDateStart);
        searchRequest.setFilingDateEnd(filingDateEnd);
        searchRequest.setLodgementDateStart(lodgementDateStart);
        searchRequest.setLodgementDateEnd(lodgementDateEnd);

        return patentSearchCommand.execute(searchRequest);
    }

    @GetMapping("/search-embedding")
    public ResponseEntity<?> searchByTitleEmbedding(
        @RequestParam String queryText,
        @RequestParam(required = false, defaultValue = "0.8") Double similarityThreshold, 
        @RequestParam(required = false, defaultValue="10") Integer k) {

    EmbeddingSearchRequest request = new EmbeddingSearchRequest();
    request.setQueryText(queryText);
    request.setSimilarityThreshold(similarityThreshold);
    request.setK(k);
    return patentSearchCommand.executeEmbeddingSearch(request);
}


}
