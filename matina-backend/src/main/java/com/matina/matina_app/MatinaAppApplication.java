package com.matina.matina_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
// Add these 3 annotations:
@EntityScan(basePackages = "com.matina.matina_app.model")
@EnableJpaRepositories(basePackages = "com.matina.matina_app.repository")
public class MatinaAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(MatinaAppApplication.class, args);
    }
}