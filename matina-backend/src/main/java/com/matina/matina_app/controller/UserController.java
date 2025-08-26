package com.matina.matina_app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.matina.matina_app.model.User;
import com.matina.matina_app.services.UserService;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map; // 1. ADD THIS IMPORT

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    // 2. USE CONSTRUCTOR INJECTION (replaces @Autowired)
    public UserController(UserService userService) {
        this.userService = userService;
    }

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
            return ResponseEntity.ok(userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

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

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user.");
        }
    }

    @PutMapping("/password/{userId}")
    public ResponseEntity<?> updateUserPassword(@PathVariable Long userId, @RequestBody PasswordUpdateRequest request) {
        try {
            userService.updateUserPassword(userId, request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 3. MAKE INNER CLASSES PUBLIC
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class PasswordUpdateRequest {
        private String newPassword;
    }
}