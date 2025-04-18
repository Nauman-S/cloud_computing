package com.cs5224.ipos.model.ai;

import lombok.Data;

@Data
public class TerminationResponse {
    public int prompt_tokens;

    public int completion_tokens;

    public int total_tokens;

    public String finalMessage;

    public String error;
}
