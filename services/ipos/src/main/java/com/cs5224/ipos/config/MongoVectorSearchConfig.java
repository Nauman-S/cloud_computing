package com.cs5224.ipos.config;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.mongodb.atlas.MongoDBAtlasVectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import static com.cs5224.ipos.constants.MongoConstants.PATENT_COLLECTION;
import static com.cs5224.ipos.constants.MongoConstants.PATENT_VECTOR_INDEX;

@Configuration
public class MongoVectorSearchConfig {

    private int DEFAULT_NUM_CANDIDATES = 10;

    @Value("${spring.ai.vector-store.mongodb.path-name}")
    private String embeddingPath;

    @Bean(name="iposVectorStore")
    public VectorStore iposVectorStore(@Qualifier("mongoIposDB")MongoTemplate mongoTemplate, EmbeddingModel embeddingModel) {
        return MongoDBAtlasVectorStore.builder(mongoTemplate, embeddingModel)
                .collectionName(PATENT_COLLECTION)
                .vectorIndexName(PATENT_VECTOR_INDEX)
                .initializeSchema(false)
                .numCandidates(DEFAULT_NUM_CANDIDATES)
                .pathName(embeddingPath).build();
    }
}
