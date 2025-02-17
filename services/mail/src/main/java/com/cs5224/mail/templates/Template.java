package com.cs5224.mail.templates;

public enum Template {
    OTP_TEMPLATE("otp template");
    private final String value;


    Template(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return this.value;
    }


}
