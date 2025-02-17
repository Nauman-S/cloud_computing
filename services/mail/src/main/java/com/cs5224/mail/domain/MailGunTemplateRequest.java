package com.cs5224.mail.domain;

import com.cs5224.mail.templates.Template;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MailGunTemplateRequest extends MailGunRequest {
    private Template template;

    private Record mailGunVariables;
}
