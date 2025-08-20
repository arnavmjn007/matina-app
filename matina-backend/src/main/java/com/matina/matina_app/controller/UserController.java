package com.matina.matina_app.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.matina.matina_app.model.User;
import com.matina.matina_app.services.UserService;

import lombok.Data;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // Allows requests from your React frontend
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Endpoint to handle new user registration.
     * Consumes multipart/form-data to accept both JSON data and a file upload.
     * @param userDataJson A string containing the user's data in JSON format.
     * @param file The user's profile image.
     * @return The created user object with a 201 CREATED status.
     */
    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public ResponseEntity<?> registerUser(
            @RequestParam("userData") String userDataJson,
            @RequestParam("file") MultipartFile file) {
        try {
            // ObjectMapper is used to convert the JSON string into a Java User object
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule()); // Important for handling dates
            User user = objectMapper.readValue(userDataJson, User.class);

            User registeredUser = userService.registerUser(user, file);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (IOException | IllegalStateException e) {
            // Catches errors from JSON parsing or if the user already exists
            return new ResponseEntity<>("Registration failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * Endpoint to handle user login.
     * @param loginRequest A JSON object containing the user's email and password.
     * @return The full user object on success or an error message on failure.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            // Catches errors like "User not found" or "Invalid credentials"
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
    
    /**
     * A simple Data Transfer Object (DTO) for receiving login credentials.
     * Using a class like this is cleaner than accepting multiple parameters.
     */
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }
}