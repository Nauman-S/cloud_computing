package com.cs5224.ipos.security;

import lombok.ToString;

@ToString
public enum Roles {
    TESTER("TEST");

    String role;
    Roles(String role) {
        this.role = role;
    }
}
