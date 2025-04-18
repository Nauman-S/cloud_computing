package com.cs5224.ipos.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RedirectRequest extends Request{

    @JsonProperty("redirectUrl")
    private String redirectUrl;
}
