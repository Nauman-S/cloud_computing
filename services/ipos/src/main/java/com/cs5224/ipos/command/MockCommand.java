package com.cs5224.ipos.command;

import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Component;
import static org.springframework.http.codec.ServerSentEvent.builder;
import reactor.core.publisher.Flux;
import java.time.Duration;

@Component
public class MockCommand {
    public Flux<ServerSentEvent<String>> execute(String userQuery) {
        return Flux.just(
                        "Generating respoxnse for query...",
                        userQuery,
                        "\n.",
                        "Lorem ipsum dolor sit amet.",
                        "Consectetur adipiscing elit.",
                        "Sed do eiusmod tempor incididunt.",
                        "Ut labore et dolore magna aliqua.",
                        "Ut enim ad minim veniam.",
                        "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        "End of response."
                )
                .delayElements(Duration.ofSeconds(1))
                .map(msg -> builder(msg).build());
    }
}