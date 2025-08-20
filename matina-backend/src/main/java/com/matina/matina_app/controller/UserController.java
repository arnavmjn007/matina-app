package com.matina.matina_app.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public ResponseEntity<?> registerUser(
            @RequestParam("userData") String userDataJson,
            @RequestParam("file") MultipartFile file) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            User user = objectMapper.readValue(userDataJson, User.class);

            User registeredUser = userService.registerUser(user, file);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (IOException | IllegalStateException e) {
            return new ResponseEntity<>("Registration failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // --- NEW ENDPOINTS FOR DISCOVERY, LIKES, AND MATCHES ---

    @GetMapping("/discover/{userId}")
    public ResponseEntity<List<User>> getDiscoveryUsers(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getDiscoveryUsers(userId));
    }

    @GetMapping("/liked/{userId}")
    public ResponseEntity<List<User>> getLikedUsers(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getLikedUsers(userId));
    }

    @GetMapping("/matches/{userId}")
    public ResponseEntity<List<User>> getMatches(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getMatches(userId));
    }


    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }
}