package com.matina.matina_app.services;

import com.matina.matina_app.dto.LoginResponse;
import com.matina.matina_app.model.Interaction;
import com.matina.matina_app.model.User;
import com.matina.matina_app.model.UserImage;
import com.matina.matina_app.repository.InteractionRepository;
import com.matina.matina_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final InteractionRepository interactionRepository;
    private final ImageUploadService imageUploadService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public User registerUser(User user, List<MultipartFile> files) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("User with this email already exists.");
        }

        if (user.getUserProfile() == null || user.getUserBasics() == null || user.getUserPersonality() == null) {
            throw new IllegalStateException("Incomplete user data received. Profile, Basics, or Personality data is missing.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getUserProfile() != null) user.getUserProfile().setUser(user);
        if (user.getUserBasics() != null) user.getUserBasics().setUser(user);
        if (user.getUserPersonality() != null) user.getUserPersonality().setUser(user);

        if (user.getImages() == null) {
            user.setImages(new java.util.ArrayList<>());
        }

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    try {
                        String imageUrl = imageUploadService.uploadFile(file);
                        user.getImages().add(new UserImage(imageUrl, user));
                    } catch (Exception e) {
                        System.err.println("Failed to upload image during registration: " + e.getMessage());
                    }
                }
            }
        }

        return userRepository.save(user);
    }

    public LoginResponse loginUser(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwtToken = jwtService.generateToken(userDetails);

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
        List<Long> likerIds = interactionRepository.findBySwipedIdAndAction(currentUserId, "like").stream()
                .map(Interaction::getSwiperId)
                .collect(Collectors.toList());

        List<Long> swipedOnIds = interactionRepository.findBySwiperId(currentUserId).stream()
                .map(Interaction::getSwipedId)
                .collect(Collectors.toList());

        List<Long> unswipedLikerIds = likerIds.stream()
                .filter(id -> !swipedOnIds.contains(id))
                .collect(Collectors.toList());

        return userRepository.findAllById(unswipedLikerIds);
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

        user.getImages().forEach(image -> imageUploadService.deleteImage(image.getImageUrl()));

        userRepository.deleteById(userId);
    }

    public void updateUserPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void updateProfileImage(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete all existing images from Cloudinary
        user.getImages().forEach(image -> imageUploadService.deleteImage(image.getImageUrl()));

        // Clear the images list to prepare for the new image
        user.getImages().clear();

        // Upload the new image
        String newImageUrl = imageUploadService.uploadFile(file);
        user.getImages().add(new UserImage(newImageUrl, user));

        userRepository.save(user);
    }
}