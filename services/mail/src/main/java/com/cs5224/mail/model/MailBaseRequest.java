package com.cs5224.mail.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class MailBaseRequest {

    private String to;

    private String subject;
}
