package com.cs5224.mail.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class OtpRequest extends MailBaseRequest{
    private String verifyLink;
    private String otpValidity;
    private String otpCode;
    private String username;
    private String verifyText;
    private String message;
}