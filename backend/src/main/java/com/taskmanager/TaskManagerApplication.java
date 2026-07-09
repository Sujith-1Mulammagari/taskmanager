package com.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * MAIN ENTRY POINT of the Spring Boot application
 * 
 * @SpringBootApplication is a combo of 3 annotations:
 *   1. @Configuration      - marks this as a config class
 *   2. @EnableAutoConfiguration - Spring Boot auto-configures beans based on classpath
 *   3. @ComponentScan      - scans all classes in this package and sub-packages
 */
@SpringBootApplication
public class TaskManagerApplication {

    public static void main(String[] args) {
        // This starts the embedded Tomcat server and the Spring context
        SpringApplication.run(TaskManagerApplication.class, args);
    }
}
