package com.cs5224.ipos.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.ai.embedding.EmbeddingOptions;

@Getter
@Setter
public class VoyagerAiEmbeddingOptions implements EmbeddingOptions {
    public static Builder builder() {
        return new Builder();
    }

    private @JsonProperty("model") String model;

    private @JsonProperty("dimensions") Integer dimensions;
    @Override
    public String getModel() {
        return this.model;
    }

    @Override
    public Integer getDimensions() {
        return this.dimensions;
    }



    public static class Builder {
        protected VoyagerAiEmbeddingOptions options;

        public Builder() {
            this.options = new VoyagerAiEmbeddingOptions();
        }
        public Builder dimensions(Integer dimensions) {
            this.options.dimensions = dimensions;
            return this;
        }

        public Builder model(String model) {
            this.options.model = model;
            return this;
        }

        public VoyagerAiEmbeddingOptions build () {
            return this.options;
        }
    }
}
