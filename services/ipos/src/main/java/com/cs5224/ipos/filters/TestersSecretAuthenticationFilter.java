package com.cs5224.ipos.filters;

import com.cs5224.ipos.security.authTokens.TestersAuthenticationToken;
import com.cs5224.ipos.security.authorities.AllAccessAuthority;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import static com.cs5224.ipos.security.Constants.TESTER_SPECIAL_REQUEST_HEADER;

@Slf4j
public class TestersSecretAuthenticationFilter extends OncePerRequestFilter {
    private final AuthenticationManager authenticationManager;

//    @Autowired
//    SecurityContextRepository scr; Persistent Security Context not used, use In MEM SecurityContextHolder


    public TestersSecretAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if (isNotATestersRequest(request) && !isReactiveEndpoint(request)) {
            filterChain.doFilter(request, response);
            return;
        }
        log.info("Testing Request from IP: {}",request.getRemoteAddr());

        final String API_ACCESS_KEY = extractApiKeyFromRequest(request);
        List<GrantedAuthority> authoritiesForTester = List.of(new AllAccessAuthority());
        TestersAuthenticationToken token = new TestersAuthenticationToken(authoritiesForTester, API_ACCESS_KEY);

        Authentication authentication = authenticationManager.authenticate(token);

        if (!authentication.isAuthenticated()) {
            log.warn("Unknown Request From IP :{}, rejected", request.getRemoteAddr());
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.getWriter().write("Invalid Credential");
            return;
        }

        log.info("Testing Request Success: {} ", authentication.getPrincipal());
        var context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(token);
        SecurityContextHolder.getContextHolderStrategy().setContext(context);
//        scr.saveContext(context, request, response);

        filterChain.doFilter(request, response);
    }

    private boolean isReactiveEndpoint(HttpServletRequest request) {
        return request.getRequestURI().contains("/chat/stream");
    }

    private boolean isNotATestersRequest(HttpServletRequest request) {
        Iterator<String> i = request.getHeaderNames().asIterator();
        while (i.hasNext()) {
            if (i.next().equalsIgnoreCase(TESTER_SPECIAL_REQUEST_HEADER)) {
                return false;
            }
        }
        return true;
    }

    private String extractApiKeyFromRequest(HttpServletRequest request) {
        return request.getHeader(TESTER_SPECIAL_REQUEST_HEADER);
    }
}