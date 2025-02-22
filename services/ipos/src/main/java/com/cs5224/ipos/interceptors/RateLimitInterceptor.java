package com.cs5224.ipos.interceptors;

import com.cs5224.ipos.domain.UserIdentifier;
import com.cs5224.ipos.service.rateLimiting.RateLimitingService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import static com.cs5224.ipos.constants.CaffeineConstants.*;

@Slf4j
@Component
public class RateLimitInterceptor implements HandlerInterceptor {
    @Autowired
    private RateLimitingService rateLimitingService;

    @Override
    public  boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Object identifier;
        if ((identifier = request.getSession().getAttribute("identifier"))==null) {

        } else if (identifier instanceof UserIdentifier uid) {
            boolean allowed = false;

            Bucket bucket = rateLimitingService.resolveBucket(uid);

            if (uid.makeVerbose()) {
                ConsumptionProbe cp = bucket.tryConsumeAndReturnRemaining(1);
                if (cp.isConsumed()) {
                    allowed = true;
                    response.setHeader(RATE_LIMIT_REMAINING, String.valueOf(cp.getRemainingTokens()));
                } else {
                    long rateLimitSeconds = cp.getNanosToWaitForRefill()/BILLION;
                    response.setHeader(RETRY_AFTER_SECONDS, String.valueOf(rateLimitSeconds));
                    log.warn(String.format("%s Privileged user requesting too frequently - Retry in %d",uid.getUniqueIdentifier(),rateLimitSeconds));
                }
            } else {
                if (!(allowed = bucket.tryConsume(1)))  {
                    log.warn(String.format("%s Foreign user requesting too frequently - Country %s, Ip %s", uid.getUniqueIdentifier(), uid.getCountry(), request.getRemoteAddr()));
                }
            }
            return allowed;
        }
        log.error("Identifier Could Not Be Resolved");
        return false;
    }
}
