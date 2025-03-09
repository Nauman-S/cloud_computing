package com.cs5224.ipos.ai;

import com.cs5224.ipos.ai.api.VoyagerAiApi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.metadata.DefaultUsage;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.*;
import org.springframework.ai.model.ModelOptionsUtils;
import org.springframework.ai.retry.RetryUtils;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.util.Assert;

import java.util.List;

import static com.cs5224.ipos.ai.api.VoyagerAiApi.DEFAULT_EMBEDDING_MODEL;

public class VoyagerModel extends AbstractEmbeddingModel {
    private static final Logger logger = LoggerFactory.getLogger(VoyagerModel.class);

    private final VoyagerAiEmbeddingOptions defaultOptions;

    private final RetryTemplate retryTemplate;

    private final VoyagerAiApi voyagerAiApi;

    public VoyagerModel(VoyagerAiApi voyagerAiApi, VoyagerAiEmbeddingOptions voyagerAiEmbeddingOptions) {
        this(voyagerAiApi, voyagerAiEmbeddingOptions, RetryUtils.DEFAULT_RETRY_TEMPLATE);
    }

    public VoyagerModel(VoyagerAiApi voyagerAiApi) {
        this(voyagerAiApi, VoyagerAiEmbeddingOptions.builder().model(DEFAULT_EMBEDDING_MODEL).build());
    }
    public VoyagerModel(VoyagerAiApi voyagerAiApi, VoyagerAiEmbeddingOptions options, RetryTemplate retryTemplate){
        Assert.notNull(voyagerAiApi, "voyagerAiApi must not be null");
        Assert.notNull(options, "options must not be null");
        Assert.notNull(retryTemplate,"retryTemplate must not be null");

        this.defaultOptions = options;
        this.voyagerAiApi = voyagerAiApi;
        this.retryTemplate = retryTemplate;
    }

    @Override
    public EmbeddingResponse call(EmbeddingRequest request) {
        VoyagerAiEmbeddingOptions options = mergeOptions(request.getOptions(), defaultOptions);
        VoyagerAiApi.EmbeddingRequest<String> apiRequest = createRequest(request, options);



        VoyagerAiApi.EmbeddingList<VoyagerAiApi.Embedding> apiEmbeddingResponse =  this.retryTemplate.execute(ctx ->
                this.voyagerAiApi.embeddings(apiRequest).getBody());

        List<Embedding> embeddings =apiEmbeddingResponse
                .data()
                .stream()
                .map(e -> new Embedding(e.embedding(), e.index()))
                .toList();

        EmbeddingResponseMetadata metadata = new EmbeddingResponseMetadata(apiEmbeddingResponse.model(), getDefaultUsage(apiEmbeddingResponse.usage()));


        EmbeddingResponse embeddingResponse = new EmbeddingResponse(embeddings, metadata);
        return embeddingResponse;
    }

    @Override
    public float[] embed(Document document) {
        Assert.notNull(document, "Document must not be null");
        return this.embed(document.getText());
    }
    private VoyagerAiApi.EmbeddingRequest<String> createRequest(EmbeddingRequest embeddingRequest, VoyagerAiEmbeddingOptions options) {
        return new VoyagerAiApi.EmbeddingRequest<>(embeddingRequest.getInstructions().getFirst(),options.getModel(),null, options.getDimensions());
    }

    private VoyagerAiEmbeddingOptions mergeOptions(EmbeddingOptions genericEmbeddingOptions, VoyagerAiEmbeddingOptions voyagerOptions) {
        VoyagerAiEmbeddingOptions options = ModelOptionsUtils.copyToTarget(genericEmbeddingOptions, EmbeddingOptions.class, VoyagerAiEmbeddingOptions.class);
        if (options == null) {
            return voyagerOptions;
        }
        return VoyagerAiEmbeddingOptions.builder()
                .model(ModelOptionsUtils.mergeOption(genericEmbeddingOptions.getModel(), voyagerOptions.getModel()))
                .dimensions(ModelOptionsUtils.mergeOption(genericEmbeddingOptions.getDimensions(), voyagerOptions.getDimensions()))
                .build();
    }

    private DefaultUsage getDefaultUsage(VoyagerAiApi.Usage usage) {
        return new DefaultUsage(-1,-1,usage.totalTokens());
    }
}
