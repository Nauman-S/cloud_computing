package com.cs5224.ipos.command;

import com.cs5224.ipos.service.embedding.EmbeddingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ChatCommand {

    @Autowired
    EmbeddingService embeddingService;
    public ResponseEntity<?> execute(String query) {
        log.info("Query Received : {}", query);
        float [] embeddings = embeddingService.embed(query);
        return ResponseEntity.status(HttpStatusCode.valueOf(200)).build();
    }
}
