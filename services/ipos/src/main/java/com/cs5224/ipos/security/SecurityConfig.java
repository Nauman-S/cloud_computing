package com.cs5224.ipos.security;
//MOVE RATELIMITER BEFORE AUTHNETICATIONPROVIDER
//

import com.cs5224.ipos.filters.RedirectLoggingFilter;
import com.cs5224.ipos.filters.TestersSecretAuthenticationFilter;
import com.cs5224.ipos.security.authProviders.TesterAuthenticationProvider;
import com.cs5224.ipos.service.user.CustomOAuth2UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
import static com.cs5224.ipos.constants.constant.REDIRECT_URI;
import static com.cs5224.ipos.security.Constants.ALL_ACCESS_AUTHORITY;

@Slf4j
@Configuration
public class SecurityConfig {

    @Value("${security.disable}")
    private boolean disableSecurity;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity security, AuthenticationManager authenticationManager) throws Exception {
        CookieCsrfTokenRepository cookieCsrfTokenRepository =  CookieCsrfTokenRepository.withHttpOnlyFalse();
        return security.authorizeHttpRequests(requestComingIn -> {
                    if (disableSecurity) {
                        requestComingIn.requestMatchers("/**").permitAll();

                    } else {
                        requestComingIn.requestMatchers("/user/**").permitAll();
                        requestComingIn.requestMatchers("/oauth2/authorization/**").permitAll();
                        requestComingIn.requestMatchers("/chat/stream/**").permitAll();
                        requestComingIn.requestMatchers("/**").hasAuthority(ALL_ACCESS_AUTHORITY);
                        requestComingIn.anyRequest().authenticated();
                    }
                })
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/user/redirect")
                        .csrfTokenRepository(cookieCsrfTokenRepository)
                )
                .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(((request, response, authException) -> {
                    SecurityContextHolder.getContext().getAuthentication();
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                })))
                .oauth2Login(
                        oauth2 -> oauth2
                                .authorizationEndpoint(configurer -> configurer.baseUri("https://ipos.naumansajid.com/service/oauth2/authorization"))
                                .redirectionEndpoint(configurer -> configurer.baseUri("https://ipos.naumansajid.com/service/login/oauth2/code/*"))
                                .successHandler(((request, response, authentication) -> {
                                    log.info("\n\n\n\nRedirection must be DONE!!!!! {}\n\n\n\n", request.getSession().getAttribute(REDIRECT_URI));
                                    response.setStatus(HttpStatus.FOUND.value());
                                    if (!Objects.isNull(request.getSession()) && !Objects.isNull(request.getSession().getAttribute(REDIRECT_URI))) {
                                        CsrfToken csrfToken = cookieCsrfTokenRepository.generateToken(request);
                                        cookieCsrfTokenRepository.saveToken(csrfToken, request, response);
                                        response.sendRedirect(request.getSession().getAttribute(REDIRECT_URI).toString());
                                        request.getSession().setAttribute(CSRF, csrfToken.getToken());
                                        log.info("\n\n\n\nRedirecting to {}\n\n\n\n", request.getSession().getAttribute(REDIRECT_URI));
                                    } else {
                                        response.sendRedirect("https://brave-desert-074ebc30f.4.azurestaticapps.net");
                                    }
                                }))
                )
                .addFilterBefore(new TestersSecretAuthenticationFilter(authenticationManager), AuthorizationFilter.class)
                .addFilterBefore(new RedirectLoggingFilter(), TestersSecretAuthenticationFilter.class)

                .authenticationManager(authenticationManager)
                .build();
    }

    @Bean
    public OAuth2LoginAuthenticationProvider oauth2LoginAuthenticationProvider() {
        return new OAuth2LoginAuthenticationProvider(new DefaultAuthorizationCodeTokenResponseClient(), new CustomOAuth2UserService());
    }

    @Bean
    AuthenticationManager authenticationManager(OAuth2LoginAuthenticationProvider oAuth2LoginAuthenticationProvider) {
        AuthenticationManager manager = new ProviderManager(oAuth2LoginAuthenticationProvider, new TesterAuthenticationProvider());
        return manager;
    }

    @Bean
    ApplicationListener<AuthenticationSuccessEvent> listener() {
        return (evt) -> {
            var auth = evt.getAuthentication();
            log.info("Auth Success [%s]", auth.getName());
        };

    }


    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "https://brave-desert-074ebc30f.4.azurestaticapps.net",
                "https://frontend.ipos.naumansajid.com"
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
