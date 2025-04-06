package com.cs5224.ipos.command;

import com.cs5224.ipos.dto.PatentSearchRequest;
import com.cs5224.ipos.model.documents.Patent;
import com.cs5224.ipos.service.search.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Component
public class PatentSearchCommand {

    @Autowired
    private PatentSearchService patentSearchService;

    public ResponseEntity<?> execute(PatentSearchRequest request) {
        List<Patent> results = patentSearchService.searchPatents(request);
        if (results == null || results.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(results);
    }
}
