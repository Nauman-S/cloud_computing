package com.cs5224.mail.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpResponse extends MailBaseResponse{
    private String message;
}
