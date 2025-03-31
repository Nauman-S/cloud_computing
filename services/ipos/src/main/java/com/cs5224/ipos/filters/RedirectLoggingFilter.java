package com.cs5224.ipos.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;

@Component
public class RedirectLoggingFilter extends GenericFilterBean {
    private static final Logger LOGGER = LoggerFactory.getLogger(RedirectLoggingFilter.class);

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;



            // Now we have both the raw HttpServletRequest and HttpServletResponse

        // Convert to your custom request and response wrappers which log bodies
        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(req);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(res);

        // Continue with the filter chain
        chain.doFilter(requestWrapper, responseWrapper);

        // Log the request - use your logging logic here
        String requestBody = new String(requestWrapper.getContentAsByteArray());


        // Log the response - use your logging logic here
        String responseBody = new String(responseWrapper.getContentAsByteArray());

        if (req.getRequestURI().matches(".*/oauth2/authorization/github.*")) {
            LOGGER.info("Request Body {}",  requestBody);
            LOGGER.info("Response Body {}", responseBody);
        }
        // Make sure to copy the content back to the original HttpServletResponse after logging it
        responseWrapper.copyBodyToResponse();
    }
}