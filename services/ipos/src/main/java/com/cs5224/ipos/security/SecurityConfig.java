package com.cs5224.ipos.security;
//MOVE RATELIMITER BEFORE AUTHNETICATIONPROVIDER
//

import com.cs5224.ipos.filters.TestersSecretAuthenticationFilter;
import com.cs5224.ipos.security.authProviders.TesterAuthenticationProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

import static com.cs5224.ipos.security.Constants.ALL_ACCESS_AUTHORITY;

@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${security.disable}")
    private boolean disableSecurity;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity security, AuthenticationManager authenticationManager) throws Exception {
        return security.authorizeHttpRequests(requestComingIn -> {
            if (disableSecurity) {
                requestComingIn.requestMatchers("/**").permitAll();
            } else {
                requestComingIn.requestMatchers("/**").hasAuthority(ALL_ACCESS_AUTHORITY);
                requestComingIn.anyRequest().authenticated();
            }
        })
                .addFilterBefore(new TestersSecretAuthenticationFilter(authenticationManager), AuthorizationFilter.class)
                .authenticationManager(authenticationManager)
                .build();
    }

    @Bean AuthenticationManager authenticationManager () {
        AuthenticationManager manager = new ProviderManager(new TesterAuthenticationProvider());
        return manager;
    }

    @Bean
    ApplicationListener<AuthenticationSuccessEvent>  listener() {
        return (evt) -> {
            var auth = evt.getAuthentication();
            log.info("Auth Success [%s]", auth.getName());
        };
    }
}
