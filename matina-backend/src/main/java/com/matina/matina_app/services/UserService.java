package com.matina.matina_app.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.matina.matina_app.dto.LoginResponse;
import com.matina.matina_app.model.Interaction;
import com.matina.matina_app.model.User;
import com.matina.matina_app.repository.InteractionRepository;
import com.matina.matina_app.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // Lombok constructor for dependency injection
public class UserService {

    private final UserRepository userRepository;
    private final InteractionRepository interactionRepository;
    private final ImageUploadService imageUploadService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public User registerUser(User user, MultipartFile file) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("User with this email already exists.");
        }
        if (user.getUserProfile() == null || user.getUserBasics() == null || user.getUserPersonality() == null) {
            throw new IllegalStateException("Incomplete user data received.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (file != null && !file.isEmpty()) {
            String imageUrl = imageUploadService.uploadFile(file);
            user.getUserProfile().setProfileImageUrl(imageUrl);
        }

        user.getUserProfile().setUser(user);
        user.getUserBasics().setUser(user);
        user.getUserPersonality().setUser(user);

        return userRepository.save(user);
    }

    public LoginResponse loginUser(String email, String password) {
        // Authenticate the user with Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        // If authentication is successful, find user and generate token
        User user = userRepository.findByEmail(email).orElseThrow();
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwtToken = jwtService.generateToken(userDetails);

        // Return both the token and the user object
        return new LoginResponse(jwtToken, user);
    }

    public List<User> getDiscoveryUsers(Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId).orElseThrow(() -> new RuntimeException("User not found"));
        String targetGender = "man".equalsIgnoreCase(currentUser.getUserProfile().getGender()) ? "woman" : "man";
        List<Long> swipedIds = interactionRepository.findBySwiperId(currentUserId).stream()
                .map(Interaction::getSwipedId)
                .collect(Collectors.toList());

        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .filter(user -> user.getUserProfile() != null && targetGender.equalsIgnoreCase(user.getUserProfile().getGender()))
                .filter(user -> !swipedIds.contains(user.getId()))
                .collect(Collectors.toList());
    }

    public List<User> getLikedUsers(Long currentUserId) {
        // 1. Find IDs of users who have liked the current user
        List<Long> likerIds = interactionRepository.findBySwipedIdAndAction(currentUserId, "like").stream()
                .map(Interaction::getSwiperId)
                .collect(Collectors.toList());

        // 2. Find IDs of users the current user has already swiped on (liked OR disliked)
        List<Long> alreadySwipedIds = interactionRepository.findBySwiperId(currentUserId).stream()
                .map(Interaction::getSwipedId)
                .collect(Collectors.toList());

        // 3. Filter the list of likers to remove anyone the current user has already actioned
        List<Long> finalLikerIds = likerIds.stream()
                .filter(likerId -> !alreadySwipedIds.contains(likerId))
                .collect(Collectors.toList());

        return userRepository.findAllById(finalLikerIds);
    }

    public List<User> getMatches(Long currentUserId) {
        List<Long> usersWhoLikedYou = interactionRepository.findBySwipedIdAndAction(currentUserId, "like").stream()
                .map(Interaction::getSwiperId).collect(Collectors.toList());

        List<Long> usersYouLiked = interactionRepository.findBySwiperId(currentUserId).stream()
                .filter(interaction -> "like".equalsIgnoreCase(interaction.getAction()))
                .map(Interaction::getSwipedId)
                .collect(Collectors.toList());

        List<Long> matchIds = usersWhoLikedYou.stream()
                .filter(usersYouLiked::contains)
                .collect(Collectors.toList());

        return userRepository.findAllById(matchIds);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // First, delete the image from Cloudinary if it exists
        if (user.getUserProfile() != null && user.getUserProfile().getProfileImageUrl() != null) {
            imageUploadService.deleteImage(user.getUserProfile().getProfileImageUrl());
        }

        // Then, delete the user from the database
        userRepository.deleteById(userId);
    }

    public void updateUserPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
