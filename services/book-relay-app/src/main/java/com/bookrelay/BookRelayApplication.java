package com.bookrelay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Modular monolith entry point. Domain code lives in sibling packages ({@code auth}, {@code catalog},
 * {@code lending}, {@code fulfillment}). Cross-module calls go through {@code integration} ports so
 * modules can be extracted to microservices later by swapping port implementations.
 */
@SpringBootApplication(scanBasePackages = "com.bookrelay")
public class BookRelayApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookRelayApplication.class, args);
    }
}
