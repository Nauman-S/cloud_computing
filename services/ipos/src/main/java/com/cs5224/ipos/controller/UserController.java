package com.cs5224.ipos.controller;

import com.cs5224.ipos.domain.RedirectRequest;
import com.cs5224.ipos.security.authTokens.TestersAuthenticationToken;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static com.cs5224.ipos.constants.constant.CSRF;
import static com.cs5224.ipos.constants.constant.REDIRECT_URI;

@RestController
@RequestMapping("/user")
public class UserController {


    private List<String> allowedRedirectDomains = Arrays.asList("http://localhost:3000/status", "http://127.0.0.1:3000/status", "https://brave-desert-074ebc30f.4.azurestaticapps.net/status", "https://frontend.ipos.naumansajid.com/status");

    @GetMapping("/info")
    public Map<String, Object> userInfo(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> userDetails = new HashMap<>();
        if (!authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            userDetails.put("authenticated", false);
            return userDetails;
        }
        userDetails.put("authenticated", true);
        userDetails.put("isTester", false);
        if (authentication instanceof OAuth2AuthenticationToken) {

            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User user = oauthToken.getPrincipal();
            for (Map.Entry<String, Object> e: user.getAttributes().entrySet()) {
                userDetails.put(e.getKey(), e.getValue());
            }
            HttpSession session = request.getSession(false);
            if (session != null) {
                userDetails.put("X-CSRF", session.getAttribute(CSRF));
            }
        } else if (authentication instanceof TestersAuthenticationToken){
            userDetails.put("isTester", true);
        }

        return userDetails;
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession httpSession;
        if ((httpSession = request.getSession(false)) != null) {
            httpSession.invalidate();
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/redirect")
    public ResponseEntity<?> redirect(HttpServletRequest request, HttpServletResponse httpServletResponse, @RequestBody RedirectRequest redirectRequest) {
        HttpSession httpSession;
        if ((httpSession = request.getSession(true)) != null) {
            if (!Objects.isNull(redirectRequest) && determineSafeRedirect(redirectRequest.getRedirectUrl())) {
                httpSession.setAttribute(REDIRECT_URI, redirectRequest.getRedirectUrl());
                ResponseCookie responseCookie = ResponseCookie.from(REDIRECT_URI, redirectRequest.getRedirectUrl()).
                        httpOnly(true)
                        .path("/")
                        .build();
                httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean determineSafeRedirect(String redirectUrl) {
        return StringUtils.hasLength(redirectUrl) &&  allowedRedirectDomains.contains(redirectUrl);
    }

}
