package com.cs5224.mail.controller;

import com.cs5224.mail.command.OtpCommand;
import com.cs5224.mail.model.OtpRequest;
import com.cs5224.mail.model.OtpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/otp")
public class OtpController {

    @Autowired
    OtpCommand otpCommand;

    @PostMapping("/generate")
    public ResponseEntity<OtpResponse> generateOtp(@RequestBody OtpRequest request) {
        return otpCommand.execute(request);
    }
}
