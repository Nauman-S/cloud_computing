package com.cs5224.mail.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OtpRequest extends MailBaseRequest{
    private String email;
    private String otp;
}
