package com.cs5224.mail.service;

import com.cs5224.mail.domain.MailGunSimpleRequest;
import com.cs5224.mail.model.MailBaseRequest;
import com.cs5224.mail.model.MailBaseResponse;
import com.cs5224.mail.model.OtpRequest;
import com.cs5224.mail.model.OtpResponse;
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


    @Value("${mailgun.api.key}")
    private String apiKey;

    @Value("${mailgun.domain}")
    private String domain;

    @Value("${mailgun.from}")
    private String from;

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
            MailGunSimpleRequest mailGunSimpleRequest = new MailGunSimpleRequest();
            mailGunSimpleRequest.setTo(request.getEmailAddress());
            mailGunSimpleRequest.setText(String.format("The otp is %s", request.getOtp()));
            mailGunSimpleRequest.setSubject("OTP Notification");
            mailGunSimpleRequest.setFrom(from);
            ResponseEntity<String> response1 = sendSimpleMail(mailGunSimpleRequest);
            log.info(response1.toString());
            response.setSuccess(true);
        }catch (RestClientException e) {
            log.error(e.getMessage());
            response.setSuccess(false);
        }

        return response;
    }

    private ResponseEntity<String> sendSimpleMail(MailGunSimpleRequest request) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.mailgun.net/v3/" + domain + "/messages";
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("api", apiKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> body = convertToMultiValueMap(request);
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
        log.info(entity.toString());
        return restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
    }

    private MultiValueMap<String, String> convertToMultiValueMap(MailGunSimpleRequest emailRequest) {
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("from", emailRequest.getFrom());
        map.add("to", emailRequest.getTo());
        map.add("subject", emailRequest.getSubject());
        map.add("text", emailRequest.getText());
        return map;
    }
}
