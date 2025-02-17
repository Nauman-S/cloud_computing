package com.cs5224.mail.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MailGunOtpRequest {

    private String contactLink;

    private String verifyLink;

    private String otpValidity;

    private String otpCode;

    private String userName;

    private String verifyText;

    private String message;

    private String appName;
}
