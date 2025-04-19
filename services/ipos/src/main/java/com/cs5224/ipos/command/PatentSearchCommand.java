package com.cs5224.ipos.command;

import com.cs5224.ipos.dto.EmbeddingSearchRequest;
import com.cs5224.ipos.dto.PatentSearchRequest;
import com.cs5224.ipos.model.documents.Patent;
import com.cs5224.ipos.service.search.*;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;

@Component
@Slf4j
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

    public ResponseEntity<?> executeEmbeddingSearch(EmbeddingSearchRequest request) {
        log.info("📥 Received embedding search request: queryText='{}', threshold={}, k={}",
            request.getQueryText(), request.getSimilarityThreshold(), request.getK());
    
        List<Patent> results = patentSearchService.searchByTitleKeyword(request);
    
        if (results == null || results.isEmpty()) {
            log.info("🔍 No patents found matching embedding search criteria.");
            return ResponseEntity.ok(Collections.emptyList());
        }
    
        log.info("✅ Found {} patent(s) matching embedding search criteria.", results.size());
        return ResponseEntity.ok(results);
    }

}
