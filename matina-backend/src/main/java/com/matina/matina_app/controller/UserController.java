package com.matina.matina_app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matina.matina_app.model.User;
import com.matina.matina_app.repository.UserRepository;
import com.matina.matina_app.services.ImageUploadService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // <-- Add this line
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestParam("userData") String userDataJson, @RequestParam("file") MultipartFile file) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            User user = objectMapper.readValue(userDataJson, User.class);

            String imageUrl = imageUploadService.uploadImage(file);
            user.setProfileImageUrl(imageUrl);

            User savedUser = userRepository.save(user);

            return ResponseEntity.ok(savedUser);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing request: " + e.getMessage());
        }
    }

    // New Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        // Find the user by email
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // In a real app, you would use a password encoder to check the password
            if (user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok(user); // Login successful
            }
        }
        
        // If user not found or password incorrect
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
}

// A simple class to hold the login request data
@Data
class LoginRequest {
    private String email;
    private String password;
}
