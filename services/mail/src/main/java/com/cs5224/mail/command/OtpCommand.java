package com.cs5224.mail.command;

import com.cs5224.mail.model.MailBaseResponse;
import com.cs5224.mail.model.OtpRequest;
import com.cs5224.mail.model.OtpResponse;
import com.cs5224.mail.service.HttpMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class OtpCommand {

    @Autowired
    HttpMailSender mailService;


    public ResponseEntity<OtpResponse> execute(OtpRequest otpRequest) {
        OtpResponse response = new OtpResponse();
        if (!validate(otpRequest)) {
            response.setSuccess(false);
            return ResponseEntity.badRequest().body(response);
        }
        MailBaseResponse mailServiceResponse =  mailService.sendMail(otpRequest, HttpMailSender.TemplateType.OTP_NOTIFICATION);

        if (mailServiceResponse.isSuccess()) {
            response.setSuccess(true);
        } else {
            response.setSuccess(false);
        }
        return ResponseEntity.ok(response);
    }


    private boolean validate(OtpRequest otpRequest) {
        return !StringUtils.isEmpty(otpRequest.getOtp()) && !StringUtils.isEmpty(otpRequest.getEmailAddress()) ;
    }

}
