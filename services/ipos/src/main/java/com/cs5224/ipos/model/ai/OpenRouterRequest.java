package com.cs5224.ipos.model.ai;

import lombok.Data;

import java.util.List;

@Data
public class OpenRouterRequest {
    String model;

    List<Message> messages;

    boolean stream;
}
