package com.cs5224.mail.service;

import com.cs5224.mail.model.MailBaseRequest;
import com.cs5224.mail.model.MailBaseResponse;

public interface HttpMailSender {
    MailBaseResponse sendMail(MailBaseRequest request, TemplateType templateType);

    enum TemplateType {
        OTP_NOTIFICATION,
        JOB_NOTIFICATION,
        MARKETING_NOTIFICATION
    }
}
