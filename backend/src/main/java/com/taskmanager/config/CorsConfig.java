package com.taskmanager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS CONFIGURATION
 * 
 * CORS = Cross-Origin Resource Sharing
 * 
 * PROBLEM:
 *   - React runs on http://localhost:3000
 *   - Spring Boot runs on http://localhost:8080
 *   - Browser BLOCKS requests between different origins (security policy)
 *   - This is called the "Same-Origin Policy"
 * 
 * SOLUTION:
 *   - Tell Spring Boot: "allow requests from localhost:3000"
 *   - Spring adds special headers to responses:
 *     Access-Control-Allow-Origin: http://localhost:3000
 * 
 * @Configuration - marks this as a Spring configuration class
 * @Bean          - tells Spring to manage this object as a bean
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow React dev server
        config.addAllowedOrigin("http://localhost:3000");

        // Allow all HTTP headers (Content-Type, Authorization, etc.)
        config.addAllowedHeader("*");

        // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
        config.addAllowedMethod("*");

        // Allow credentials (cookies, auth headers)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this CORS config to ALL endpoints ("/**")
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
