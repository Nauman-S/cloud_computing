package com.cs5224.ipos.service.user;

import com.cs5224.ipos.security.authorities.AllAccessAuthority;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.http.OAuth2ErrorResponseErrorHandler;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequestEntityConverter;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthorizationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.UnknownContentTypeException;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    public static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    private static final String INVALID_USER_INFO_RESPONSE_ERROR_CODE = "invalid_user_info_response";

    private static final ParameterizedTypeReference<Map<String, Object>> PARAMETERIZED_RESPONSE_TYPE = new ParameterizedTypeReference<>() {
    };

    private Converter<OAuth2UserRequest, RequestEntity<?>> requestEntityConverter = new OAuth2UserRequestEntityConverter();

    private Converter<OAuth2UserRequest, Converter<Map<String, Object>, Map<String, Object>>> attributesConverter = (
            request) -> (attributes) -> attributes;

    private RestOperations restOperations;

    public CustomOAuth2UserService () {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setErrorHandler(new OAuth2ErrorResponseErrorHandler());
        this.restOperations = restTemplate;
    }

    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        Assert.notNull(userRequest, "userRequest cannot be null");
        String userNameAttributeName = getUserNameAttributeName(userRequest);
        RequestEntity<?> request = this.requestEntityConverter.convert(userRequest);
        ResponseEntity<Map<String, Object>> response = this.getResponse(userRequest, request);
        OAuth2AccessToken token = userRequest.getAccessToken();
        Map<String, Object> attributes = (Map)((Converter)this.attributesConverter.convert(userRequest)).convert((Map)response.getBody());
        Collection<GrantedAuthority> authorities = this.getAuthorities(token, attributes, userNameAttributeName);
        authorities.add(new AllAccessAuthority());
        return new DefaultOAuth2User(authorities, attributes, userNameAttributeName);
    }

    private String getUserNameAttributeName(OAuth2UserRequest userRequest) {
        if (!StringUtils.hasText(userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUri())) {
            OAuth2Error oauth2Error = new OAuth2Error("missing_user_info_uri", "Missing required UserInfo Uri in UserInfoEndpoint for Client Registration: " + userRequest.getClientRegistration().getRegistrationId(), (String)null);
            throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
        } else {
            String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
            if (!StringUtils.hasText(userNameAttributeName)) {
                OAuth2Error oauth2Error = new OAuth2Error("missing_user_name_attribute", "Missing required \"user name\" attribute name in UserInfoEndpoint for Client Registration: " + userRequest.getClientRegistration().getRegistrationId(), (String)null);
                throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
            } else {
                return userNameAttributeName;
            }
        }
    }

    private ResponseEntity<Map<String, Object>> getResponse(OAuth2UserRequest userRequest, RequestEntity<?> request) {
        try {
            return this.restOperations.exchange(request, PARAMETERIZED_RESPONSE_TYPE);
        }
        catch (OAuth2AuthorizationException ex) {
            OAuth2Error oauth2Error = ex.getError();
            StringBuilder errorDetails = new StringBuilder();
            errorDetails.append("Error details: [");
            errorDetails.append("UserInfo Uri: ")
                    .append(userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUri());
            errorDetails.append(", Error Code: ").append(oauth2Error.getErrorCode());
            if (oauth2Error.getDescription() != null) {
                errorDetails.append(", Error Description: ").append(oauth2Error.getDescription());
            }
            errorDetails.append("]");
            oauth2Error = new OAuth2Error(INVALID_USER_INFO_RESPONSE_ERROR_CODE,
                    "An error occurred while attempting to retrieve the UserInfo Resource: " + errorDetails.toString(),
                    null);
            throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString(), ex);
        }
        catch (UnknownContentTypeException ex) {
            String errorMessage = "An error occurred while attempting to retrieve the UserInfo Resource from '"
                    + userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUri()
                    + "': response contains invalid content type '" + ex.getContentType().toString() + "'. "
                    + "The UserInfo Response should return a JSON object (content type 'application/json') "
                    + "that contains a collection of name and value pairs of the claims about the authenticated End-User. "
                    + "Please ensure the UserInfo Uri in UserInfoEndpoint for Client Registration '"
                    + userRequest.getClientRegistration().getRegistrationId() + "' conforms to the UserInfo Endpoint, "
                    + "as defined in OpenID Connect 1.0: 'https://openid.net/specs/openid-connect-core-1_0.html#UserInfo'";
            OAuth2Error oauth2Error = new OAuth2Error(INVALID_USER_INFO_RESPONSE_ERROR_CODE, errorMessage, null);
            throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString(), ex);
        }
        catch (RestClientException ex) {
            OAuth2Error oauth2Error = new OAuth2Error(INVALID_USER_INFO_RESPONSE_ERROR_CODE,
                    "An error occurred while attempting to retrieve the UserInfo Resource: " + ex.getMessage(), null);
            throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString(), ex);
        }
    }

    private Collection<GrantedAuthority> getAuthorities(OAuth2AccessToken token, Map<String, Object> attributes,
                                                        String userNameAttributeName) {
        Collection<GrantedAuthority> authorities = new LinkedHashSet<>();
        authorities.add(new OAuth2UserAuthority(attributes, userNameAttributeName));
        for (String authority : token.getScopes()) {
            authorities.add(new SimpleGrantedAuthority("SCOPE_" + authority));
        }
        return authorities;
    }
}
