package com.cs5224.mail.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MailGunRequest {
    private String from;
    private String to;
    private String subject;
}
