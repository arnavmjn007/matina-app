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
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;

    public UserController(UserService userService) {
        this.userService = userService;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    // --- REGISTER ---
    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public ResponseEntity<?> registerUser(
            @RequestParam("userData") String userDataJson,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        try {
            if (userDataJson == null || userDataJson.trim().isEmpty()) {
                return new ResponseEntity<>("User data is missing or empty.", HttpStatus.BAD_REQUEST);
            }
            User user = objectMapper.readValue(userDataJson, User.class);
            User registeredUser = userService.registerUser(user, files);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to parse user data: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Registration failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            return ResponseEntity.ok(userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // --- DISCOVERY / LIKED / MATCHES ---
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

    // --- UPDATE USER (JSON body) ---
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
        try {
            User savedUser = userService.updateUser(userId, updatedUser);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update user: " + e.getMessage());
        }
    }

    // --- DELETE USER ---
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user.");
        }
    }

    // --- UPDATE PASSWORD ---
    @PutMapping("/password/{userId}")
    public ResponseEntity<?> updateUserPassword(@PathVariable Long userId, @RequestBody PasswordUpdateRequest request) {
        try {
            userService.updateUserPassword(userId, request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // --- UPDATE PROFILE IMAGE ---
    @PutMapping(value = "/profile-image/{userId}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateProfileImage(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        try {
            userService.updateProfileImage(userId, file);
            return ResponseEntity.ok(Map.of("message", "Profile image updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile image.");
        }
    }

    // --- DTOs ---
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
