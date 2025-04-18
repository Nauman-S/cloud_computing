package com.cs5224.ipos.model.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OpenRouterStreamingResponse {
    public String id;

    public String provider;

    public String model;

    public String object;

    public long created;

    public List<Choice> choices;

    public Usage usage;

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Choice {

        public int index;

        public Delta delta;

        @JsonProperty("finish_reason")
        public String finishReason;

        @JsonProperty("native_finish_reason")
        public String nativeFinishReason;
    }

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Delta {

        @JsonProperty("content")
        public String content;

        @JsonProperty("role")
        public String role;
    }

    @Data
    public static class Usage {

        public int prompt_tokens;

        public int completion_tokens;

        public int total_tokens;
    }
}
