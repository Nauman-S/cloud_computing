package com.cs5224.ipos.security;
// MOVE RATELIMITER BEFORE AUTHENTICATIONPROVIDER

import com.cs5224.ipos.filters.TestersSecretAuthenticationFilter;
import com.cs5224.ipos.security.authProviders.TesterAuthenticationProvider;
import com.cs5224.ipos.service.user.CustomOAuth2UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2LoginAuthenticationProvider;
import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Objects;

import static com.cs5224.ipos.constants.constant.CSRF;
import static com.cs5224.ipos.security.Constants.ALL_ACCESS_AUTHORITY;

@Slf4j
@Configuration
public class SecurityConfig {

    @Value("${security.disable}")
    private boolean disableSecurity;

    @Value("${auth.redirect}")
    private String redirectUri;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity security, AuthenticationManager authenticationManager) throws Exception {
        CookieCsrfTokenRepository cookieCsrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        return security
            .authorizeHttpRequests(request -> {
                if (disableSecurity) {
                    request.requestMatchers("/**").permitAll();
                } else {
                    // Allow unauthenticated access to specific Actuator endpoints
                    request.requestMatchers(EndpointRequest.to("health", "info", "mappings")).permitAll();
                    // Allow open user and chat stream paths
                    request.requestMatchers("/user/**").permitAll();
                    request.requestMatchers("/chat/stream/**").permitAll();
                    // Secure everything else with authority
                    request.requestMatchers("/**").hasAuthority(ALL_ACCESS_AUTHORITY);
                    request.anyRequest().authenticated();
                }
            })
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/user/redirect")
                .csrfTokenRepository(cookieCsrfTokenRepository)
            )
            .exceptionHandling(ex -> ex.authenticationEntryPoint((req, res, exAuth) -> {
                SecurityContextHolder.getContext().getAuthentication();
                res.setStatus(HttpStatus.UNAUTHORIZED.value());
            }))
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(a -> a.baseUri("/oauth2/authorization"))
                .redirectionEndpoint(r -> r.baseUri("/login/oauth2/code/*"))
                .successHandler((req, res, auth) -> {
                    res.setStatus(HttpStatus.FOUND.value());
                    if (req.getSession() != null) {
                        CsrfToken csrfToken = cookieCsrfTokenRepository.generateToken(req);
                        cookieCsrfTokenRepository.saveToken(csrfToken, req, res);
                        req.getSession().setAttribute(CSRF, csrfToken.getToken());
                        res.sendRedirect(redirectUri);
                        log.info("Redirecting to {}", req.getSession().getAttribute(redirectUri));
                    } else {
                        res.sendRedirect("https://brave-desert-074ebc30f.4.azurestaticapps.net");
                    }
                })
            )
            .addFilterBefore(new TestersSecretAuthenticationFilter(authenticationManager), AuthorizationFilter.class)
            .authenticationManager(authenticationManager)
            .build();
    }

    @Bean
    public OAuth2LoginAuthenticationProvider oauth2LoginAuthenticationProvider() {
        return new OAuth2LoginAuthenticationProvider(
            new DefaultAuthorizationCodeTokenResponseClient(),
            new CustomOAuth2UserService()
        );
    }

    @Bean
    AuthenticationManager authenticationManager(OAuth2LoginAuthenticationProvider oAuth2LoginAuthenticationProvider) {
        return new ProviderManager(oAuth2LoginAuthenticationProvider, new TesterAuthenticationProvider());
    }

    @Bean
    ApplicationListener<AuthenticationSuccessEvent> listener() {
        return evt -> {
            var auth = evt.getAuthentication();
            log.info("Auth Success [{}]", auth.getName());
        };
    }

    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "https://localhost:3000",
            "https://brave-desert-074ebc30f.4.azurestaticapps.net",
            "https://frontend.ipos.naumansajid.com"
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        config.addExposedHeader("Set-Cookie"); // Allows Cookie headers in CORS requests

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
