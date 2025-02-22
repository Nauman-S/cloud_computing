package com.cs5224.ipos.security.authTokens;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static com.cs5224.ipos.security.Constants.TESTER_PRINCIPAL;

public class TestersAuthenticationToken extends AbstractAuthenticationToken {
    private String accessKey;
    public TestersAuthenticationToken(Collection<? extends GrantedAuthority> authorities, String API_ACCESS_KEY) {
        super(authorities);
        this.accessKey = API_ACCESS_KEY;
    }

    @Override
    public Object getCredentials() {
        return this.accessKey;
    }

    @Override
    public Object getPrincipal() {
        return TESTER_PRINCIPAL;
    }
}
