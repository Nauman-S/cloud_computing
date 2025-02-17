package com.cs5224.mail.templates;

public record OtpVariables(String contactLink, String verifyLink, String otpValidity, String otpCode, String username, String verifyText, String message, String companyName, String appName) {
}
