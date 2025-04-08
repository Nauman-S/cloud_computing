package com.cs5224.ipos.service.embedding;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.model.voyageai.VoyageAiEmbeddingModel;
import dev.langchain4j.model.voyageai.VoyageAiEmbeddingModelName;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class EmbeddingService {

    private final VoyageAiEmbeddingModel embeddingModel;

    public EmbeddingService() {
        // Retrieve the API key from the environment variables.
        String apiKey = "pa-gNZDVbJWez2Q6ie1ZPgEdlqeRpazPaj56ERY0A1dfUE";
        // if (apiKey == null || apiKey.isEmpty()) {
        //     throw new IllegalStateException("VOYAGE_API_KEY environment variable is not set.");
        // }
        
        // Initialize the Voyage AI embedding model with desired settings.
        this.embeddingModel = VoyageAiEmbeddingModel.builder()
                .apiKey(apiKey)
                .modelName(VoyageAiEmbeddingModelName.VOYAGE_3)
                .timeout(Duration.ofSeconds(60))
                .logRequests(true)
                .logResponses(true)
                .build();
    }

    /**
     * Converts the input text (keyword) to a 1024-dimensional embedding vector.
     * 
     * @param text the input text to embed.
     * @return a List of Doubles representing the embedding vector.
     */
    public List<Double> getEmbedding(String text) {
        // Get Embedding
        Response<Embedding> response = embeddingModel.embed(text);
        Embedding embedding = response.content();
       
        return embedding.vector();  
    }
}
