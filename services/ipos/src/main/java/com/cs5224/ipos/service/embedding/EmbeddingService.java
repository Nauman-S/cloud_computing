package com.cs5224.ipos.service.embedding;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Slf4j
public class EmbeddingService {

    @Autowired
    EmbeddingModel embeddingModel;
    public float [] embed (String textQuery) {
        return embeddingModel.embed(textQuery);
    }
}
