package com.cs5224.ipos.ai.api;

import com.cs5224.ipos.ai.VoyagerAiConstants;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import org.springframework.ai.model.ApiKey;
import org.springframework.ai.model.NoopApiKey;
import org.springframework.ai.model.SimpleApiKey;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

public class VoyagerAiApi {
    public static Builder builder() {
        return new Builder();
    }


    private final RestClient restClient;

    private final String embeddingsPath;

    public static final String DEFAULT_EMBEDDING_MODEL = EmbeddingModel.VOYAGE_3.getValue();



    public VoyagerAiApi (String apiKey,String baseUrl, RestClient.Builder restClientBuilder, String embeddingsPath) {
        this( apiKey, baseUrl, restClientBuilder, CollectionUtils.toMultiValueMap(Map.of()), embeddingsPath);
    }

    public VoyagerAiApi( String apiKey, String baseUrl, RestClient.Builder restClientBuilder, MultiValueMap<String, String> headers, String embeddingsPath) {
        this(new SimpleApiKey(apiKey), baseUrl ,restClientBuilder, headers, embeddingsPath );
    }
    public VoyagerAiApi(ApiKey apiKey,String baseUrl, RestClient.Builder restClientBuilder, MultiValueMap<String, String> headers, String embeddingsPath) {
        Consumer<HttpHeaders> finalHeaders = h -> {
            if (!(apiKey instanceof NoopApiKey) ){
                h.setBearerAuth(apiKey.getValue());
            }
            h.setContentType(MediaType.APPLICATION_JSON);
            h.addAll(headers);
        };

        this.restClient = restClientBuilder.baseUrl(baseUrl)
                .defaultHeaders(finalHeaders)
                .build();

        this.embeddingsPath = embeddingsPath;
    }



    public <T> ResponseEntity<EmbeddingList<Embedding>> embeddings(EmbeddingRequest<T> embeddingRequest) {
        Assert.notNull(embeddingRequest, "The request body can not be null.");
        Assert.notNull(embeddingRequest.input(), "The input can not be null.");
        Assert.isTrue(embeddingRequest.input() instanceof String, "The input must be a String");

        return this.restClient.post().uri(embeddingsPath)
                .body(embeddingRequest)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<>() {

                });
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Embedding(// @formatter:off
                            @JsonProperty("index") Integer index,
                            @JsonProperty("embedding") float[] embedding,
                            @JsonProperty("object") String object) { // @formatter:on

    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Usage(// @formatter:off
                        @JsonProperty("total_tokens") Integer totalTokens) { // @formatter:on
        }


    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record EmbeddingList<T>(// @formatter:off
                                   @JsonProperty("object") String object,
                                   @JsonProperty("data") List<T> data,
                                   @JsonProperty("model") String model,
                                   @JsonProperty("usage") Usage usage) { // @formatter:on
    }
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record EmbeddingRequest<T>(
            @JsonProperty("input") T input,
            @JsonProperty("model") String model,

            @JsonProperty("input_type") String inputType,

            @JsonProperty("output_dimension") Integer outputDimension
    ) {
    }

    public static class Builder {

        private String baseUrl = VoyagerAiConstants.DEFAULT_BASE_URL;

        private ApiKey apiKey;

        private MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        private String embeddingsPath = "/v1/embeddings";

        private RestClient.Builder restClientBuilder = RestClient.builder();

        public Builder apiKey(String simpleApiKey) {
            Assert.notNull(simpleApiKey, "simpleApiKey cannot be null");
            this.apiKey = new SimpleApiKey(simpleApiKey);
            return this;
        }

        public VoyagerAiApi build() {
            Assert.notNull(this.apiKey, "api Key must be set");
            return new VoyagerAiApi(apiKey, baseUrl, restClientBuilder, headers, this.embeddingsPath);
        }
    }

    @Getter
    public enum EmbeddingModel {
        VOYAGE_3("voyage-3"),
        VOYAGE_3_LARGE("voyage-3-large"),
        VOYAGE_3_LITE("voyage-3-lite"),
        VOYAGE_3_CODE("voyage-code-3"),
        VOYAGE_FINANCE_2("voyage-finance-2"),
        VOYAGE_LAW_2("voyage-law-2"),
        VOYAGE_CODE_2("voyage-code-2")
        ;
        public final String value;
        EmbeddingModel(String value) {
            this.value = value;
        }
    }
}

