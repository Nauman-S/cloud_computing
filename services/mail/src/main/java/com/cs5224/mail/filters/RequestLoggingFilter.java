package com.cs5224.mail.filters;


import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;


import java.io.IOException;


@Slf4j
@Component
@Order(1)
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        if (servletRequest instanceof HttpServletRequest e) {
            var repeatable = new RepeatableContentCachingRequestWrapper(e);
            log.info("{} - {}  :  {}",e.getMethod(),e.getPathInfo() ,repeatable.getInputStream().readAllBytes().toString());
            filterChain.doFilter(repeatable, servletResponse);
            if (servletResponse instanceof HttpServletResponse response) {
                log.info("{}", response.getStatus());
            }
            return;
        }
        log.error("Invalid Protocol {} - {},{} ",servletRequest.getProtocol(),servletRequest.getRemoteAddr(),servletRequest.getRemoteHost());
    }
}
