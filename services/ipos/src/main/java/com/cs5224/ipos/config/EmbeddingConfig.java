package com.cs5224.ipos.config;

import com.cs5224.ipos.ai.VoyagerModel;
import com.cs5224.ipos.ai.api.VoyagerAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Configuration
public class EmbeddingConfig {
    @Value("${spring.ai.voyager.api-key}")
    private String apiKey;

    @Value("${spring.ai.voyager.model}") // Correct property key
    private String model;

    @Bean
    VoyagerAiApi voyagerAiApi() {
        return VoyagerAiApi.builder().apiKey(apiKey).build();
    }

    @Bean
    VoyagerModel embeddingModel(VoyagerAiApi voyagerAiApi) {
        return new VoyagerModel(voyagerAiApi);
    }
}
