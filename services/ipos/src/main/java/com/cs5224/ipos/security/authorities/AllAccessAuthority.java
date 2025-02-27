package com.cs5224.ipos.security.authorities;

import org.springframework.security.core.GrantedAuthority;

import static com.cs5224.ipos.security.Constants.ALL_ACCESS_AUTHORITY;

public class AllAccessAuthority implements GrantedAuthority {
    @Override
    public String getAuthority() {
        return ALL_ACCESS_AUTHORITY;
    }
}
