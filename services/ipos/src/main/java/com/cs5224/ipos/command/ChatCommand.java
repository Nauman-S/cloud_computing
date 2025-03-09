package com.cs5224.ipos.command;

import com.cs5224.ipos.ai.context.VoyagerTokenContext;
import com.cs5224.ipos.dao.patent.PatentVectorSearchRepository;
import org.springframework.ai.document.Document;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class ChatCommand {
    @Autowired
    PatentVectorSearchRepository patentVectorSearchRepository;

    public ResponseEntity<?> execute(String query) {
        log.info("Query Received : {}", query);
        VoyagerTokenContext.setTokenCount(0);
        SearchRequest searchRequest = SearchRequest.builder().query(query).build();
        List<Document> result = patentVectorSearchRepository.semanticSearch(searchRequest);
        log.info("Found {} matching Documents - {} tokens used for query Embeddings",result.size(), VoyagerTokenContext.getTokenCount());
        VoyagerTokenContext.clear();
        return ResponseEntity.status(HttpStatusCode.valueOf(200)).build();
    }
}
