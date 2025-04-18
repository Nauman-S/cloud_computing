package com.cs5224.ipos.command;

import com.cs5224.ipos.service.rag.OpenRouterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

import static org.springframework.http.codec.ServerSentEvent.builder;

@Component
public class RagCommand {

    @Autowired
    OpenRouterService openRouterService;
    public Flux<ServerSentEvent<String>> execute(String query) {
        Flux<String> response = openRouterService.queryRAGModel(query);

        return response.map(msg -> builder(msg).build());
    }
}
