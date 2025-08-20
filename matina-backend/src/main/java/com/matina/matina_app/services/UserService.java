package com.matina.matina_app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.matina.matina_app.model.User;
import com.matina.matina_app.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ImageUploadService imageUploadService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(User user, MultipartFile file) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("User with this email already exists.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // FIX: Add null checks to prevent crashes
        if (user.getUserProfile() == null || user.getUserBasics() == null || user.getUserPersonality() == null) {
            throw new IllegalStateException("Incomplete user data received. Profile, basics, or personality data is missing.");
        }

        if (file != null && !file.isEmpty()) {
            String imageUrl = imageUploadService.uploadFile(file);
            user.getUserProfile().setProfileImageUrl(imageUrl);
        }

        // Establish the bidirectional relationships
        user.getUserProfile().setUser(user);
        user.getUserBasics().setUser(user);
        user.getUserPersonality().setUser(user);

        return userRepository.save(user);
    }
    
    // ... loginUser method remains the same
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        } else {
            throw new IllegalArgumentException("Invalid credentials provided.");
        }
    }
}