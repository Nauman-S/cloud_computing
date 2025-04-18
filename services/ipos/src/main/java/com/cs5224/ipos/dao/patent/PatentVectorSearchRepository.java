package com.cs5224.ipos.dao.patent;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PatentVectorSearchRepository {
    private final VectorStore vectorStore;

    @Autowired
    public PatentVectorSearchRepository(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }
    
    public List<Document> semanticSearch(SearchRequest searchRequest) {
        return vectorStore.similaritySearch(searchRequest);
    }
}
