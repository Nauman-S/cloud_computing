package com.cs5224.ipos.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class OpenRouterConfig {

    @Value("${spring.ai.open-router.url}")
    private String openRouterUrl;


    @Value ("${spring.ai.open-router.chat-completions}")
    private String chatCompletions;

    @Bean
    WebClient openRouterClient() {
        return WebClient.builder().baseUrl(openRouterUrl + chatCompletions).build();
    }
}
