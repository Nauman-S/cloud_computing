package com.cs5224.ipos.security.authProviders;

import com.cs5224.ipos.security.authTokens.TestersAuthenticationToken;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

public class TesterAuthenticationProvider implements AuthenticationProvider {
    private final String TESTER_SECRET_API_KEY = "tester_secret_api_key";
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (authentication instanceof TestersAuthenticationToken token) {
            if (token.getCredentials().equals(TESTER_SECRET_API_KEY)) {
                token.setAuthenticated(true);
            }
        }
        return authentication;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.isAssignableFrom(TestersAuthenticationToken.class);
    }
}
