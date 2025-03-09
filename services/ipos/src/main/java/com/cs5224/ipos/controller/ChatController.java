package com.cs5224.ipos.controller;

import com.cs5224.ipos.command.ChatCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/chat")
@RestController
public class ChatController {

    @Autowired
    ChatCommand chatCommand;
    @GetMapping()
    public ResponseEntity<?> handleUserQuery(@RequestParam String query) {
        return chatCommand.execute(query);
    }
}
