package com.cs5224.ipos.service.rag;

import com.cs5224.ipos.model.ai.Message;
import com.cs5224.ipos.model.ai.OpenRouterRequest;
import com.cs5224.ipos.model.ai.OpenRouterStreamingResponse;
import com.cs5224.ipos.model.ai.TerminationResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.Arrays;
import java.util.Objects;

@Service
public class OpenRouterService {

    private static final Logger logger = LoggerFactory.getLogger(OpenRouterService.class);

    @Value("${spring.ai.open-router.api-key}")
    private String apiKey;
    @Autowired
    WebClient webClient;

    public static final String DONE = "[DONE]";
    public Flux<String> queryRAGModel(String query) {
        OpenRouterRequest request = prepareRequest(query);
        TerminationResponse terminationResponse =new TerminationResponse();
        ObjectMapper mapper = new ObjectMapper();

        Flux<String> response =  webClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(request)
                .retrieve()
                .bodyToFlux(String.class)
                .flatMap(stringResponse -> {
                    if (stringResponse.equalsIgnoreCase(DONE)) {
                        terminationResponse.setFinalMessage(DONE);
                        logger.info("Successful: {}", terminationResponse.toString());
                        return Flux.just(terminationResponse.toString());
                    }
                    try {
                        OpenRouterStreamingResponse res = mapper.readValue(stringResponse, OpenRouterStreamingResponse.class);
                        if (Objects.nonNull(res.getUsage()) && res.getUsage().getTotal_tokens() > 0 ) {
                            terminationResponse.setPrompt_tokens(res.getUsage().getPrompt_tokens());
                            terminationResponse.setCompletion_tokens(res.getUsage().getCompletion_tokens());
                            terminationResponse.setTotal_tokens(res.getUsage().getTotal_tokens());

                        } else if (res.getChoices() != null && !res.getChoices().isEmpty()) {
                            String content = res.getChoices().get(0).getDelta().getContent();
                            return Flux.just(content);
                        }

                    } catch (Exception e) {
                        logger.error(e.toString());
                        return Flux.error(e);
                    }

                    return Flux.empty();
                })
                .onErrorStop()
                .filter(content -> StringUtils.hasText(content));

        return response;
    }

    public OpenRouterRequest prepareRequest(String query) {
        OpenRouterRequest request = new OpenRouterRequest();
        request.setStream(true);
        request.setModel("deepseek/deepseek-chat:free");

        Message message = new Message();
        message.setContent(query);
        message.setRole("user");
        request.setMessages(Arrays.asList(message));
        return request;
    }
}
