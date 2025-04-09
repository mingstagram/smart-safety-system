package com.traveloo.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TravelooApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravelooApplication.class, args);
    }
} 