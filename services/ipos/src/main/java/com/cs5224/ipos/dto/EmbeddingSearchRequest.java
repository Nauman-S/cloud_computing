package com.cs5224.ipos.dto;

import lombok.Data;

@Data
public class EmbeddingSearchRequest {
    private String queryText;
    
    // To support documents later, For now,  default this to "title"
    private String embeddingType = "title";
    
    private Double similarityThreshold = 0.8;

    private Integer k = 10; 
}
