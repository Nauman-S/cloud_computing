package com.cs5224.ipos.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class LoggingConfig {
    @Value("${logging.dir}")
    private String logDir;

    @PostConstruct
    public void init() {
        File dir = new File(logDir);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            if (created) {
                System.out.println("Log directory created: " + logDir);
            } else {
                System.err.println("Failed to create log directory: " + logDir);
            }
        }
    }
}
