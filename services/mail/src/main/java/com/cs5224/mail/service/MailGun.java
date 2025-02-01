package com.cs5224.mail.service;

import com.cs5224.mail.domain.MailGunTemplateRequest;
import com.cs5224.mail.model.MailBaseRequest;
import com.cs5224.mail.model.MailBaseResponse;
import com.cs5224.mail.model.OtpRequest;
import com.cs5224.mail.model.OtpResponse;
import com.cs5224.mail.templates.OtpVariables;
import com.cs5224.mail.templates.Template;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

@Slf4j
@Service
public class MailGun implements HttpMailSender {
    private final String APP_NAME = "CS5224";
    private final String CONTACT_LINK="https://cs5224.naumansajid.com";


    @Value("${mailgun.api.key}")
    private String apiKey;

    @Value("${mailgun.domain}")
    private String domain;

    @Value("${mailgun.from}")
    private String from;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public MailBaseResponse sendMail(MailBaseRequest request, TemplateType templateType) {

        switch (templateType) {
            case OTP_NOTIFICATION:
                return sendOTPMail((OtpRequest)request);
        }
        return null;
    }


    private OtpResponse sendOTPMail(OtpRequest request) {
        OtpResponse response = new OtpResponse();

        try {
            MailGunTemplateRequest mailGunTemplateRequest = new MailGunTemplateRequest();
            mailGunTemplateRequest.setFrom(from);
            mailGunTemplateRequest.setSubject(request.getSubject());
            mailGunTemplateRequest.setTo(request.getTo());
            mailGunTemplateRequest.setTemplate(Template.OTP_TEMPLATE);

            OtpVariables otpVariables = new OtpVariables(
                    CONTACT_LINK,
                    request.getVerifyLink(),
                    request.getOtpValidity(),
                    request.getOtpCode(),
                    request.getUsername(),
                    request.getVerifyText(),
                    request.getMessage(),
                    APP_NAME,
                    APP_NAME);
            mailGunTemplateRequest.setMailGunVariables(otpVariables);

            ResponseEntity<String> mailGunResponse = sendTemplateMail(mailGunTemplateRequest);
            log.info(mailGunResponse.toString());

            response.setSuccess(true);
        }catch (RestClientException | JsonProcessingException e) {
            log.error(e.getMessage());
            response.setSuccess(false);
        }

        return response;
    }

    private ResponseEntity<String> sendTemplateMail(MailGunTemplateRequest mailGunTemplateRequest) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.mailgun.net/v3/" + domain + "/messages";
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("api", apiKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);


        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("from", mailGunTemplateRequest.getFrom());
        map.add("to", mailGunTemplateRequest.getTo());
        map.add("subject", mailGunTemplateRequest.getSubject());
        map.add("template", mailGunTemplateRequest.getTemplate().toString());



        String mailGunVariables = objectMapper.writeValueAsString(mailGunTemplateRequest.getMailGunVariables());
        map.add("h:X-Mailgun-Variables", mailGunVariables);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);
        log.info(entity.toString());
        return restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
    }
}
