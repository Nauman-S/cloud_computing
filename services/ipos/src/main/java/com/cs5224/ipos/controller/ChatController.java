package com.cs5224.ipos.controller;

import com.cs5224.ipos.command.ChatCommand;
import com.cs5224.ipos.command.MockCommand;
import com.cs5224.ipos.command.RagCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RequestMapping("/chat")
@RestController
public class ChatController {

    @Autowired
    MockCommand mockCommand;

    @Autowired
    RagCommand ragCommand;
    @Autowired
    ChatCommand chatCommand;

    @GetMapping()
    public ResponseEntity<?> handleUserQuery(@RequestParam String query) {
        return chatCommand.execute(query);
    }

    @GetMapping("/stream")
    public Flux<ServerSentEvent<String>> handleRagRequest(@RequestParam String query) {
        return ragCommand.execute(query);
    }

    @GetMapping("/stream/mock")
    public Flux<ServerSentEvent<String>> mockStream(@RequestParam String query) {
        return mockCommand.execute(query);
    }
}
