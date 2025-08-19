package com.matina.matina_app.services;

import com.matina.matina_app.model.User;
import com.matina.matina_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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

        // Add a null check for safety
        if (user.getUserProfile() == null) {
            throw new IllegalStateException("UserProfile data is missing.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

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