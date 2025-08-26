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

import java.util.ArrayList;
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

    /**
     * Register a new user along with profile images.
     */
    @Transactional
    public User registerUser(User user, List<MultipartFile> files) {
        // Check duplicate email
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("User with this email already exists.");
        }

        // Validate required profile sections
        if (user.getUserProfile() == null || user.getUserBasics() == null || user.getUserPersonality() == null) {
            throw new IllegalStateException("Incomplete user data received. Profile, Basics, or Personality data is missing.");
        }

        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set user references in child entities
        user.getUserProfile().setUser(user);
        user.getUserBasics().setUser(user);
        user.getUserPersonality().setUser(user);

        // Initialize image list
        if (user.getImages() == null) {
            user.setImages(new ArrayList<>());
        }

        // Upload images if provided
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    try {
                        String imageUrl = imageUploadService.uploadFile(file);
                        user.getImages().add(new UserImage(imageUrl, user));
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
                    }
                }
            }
        }

        return userRepository.save(user);
    }

    /**
     * Login a user and return JWT + user details
     */
    public LoginResponse loginUser(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwtToken = jwtService.generateToken(userDetails);

        return new LoginResponse(jwtToken, user);
    }

    /**
     * Discover users (show opposite gender & not already swiped).
     */
    public List<User> getDiscoveryUsers(Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String targetGender = "man".equalsIgnoreCase(currentUser.getUserProfile().getGender())
                ? "woman" : "man";

        List<Long> swipedIds = interactionRepository.findBySwiperId(currentUserId).stream()
                .map(Interaction::getSwipedId)
                .collect(Collectors.toList());

        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .filter(user -> user.getUserProfile() != null &&
                        targetGender.equalsIgnoreCase(user.getUserProfile().getGender()))
                .filter(user -> !swipedIds.contains(user.getId()))
                .collect(Collectors.toList());
    }

    /**
     * Users who liked you, but you haven't swiped yet.
     */
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

    /**
     * Return matched users (both liked each other).
     */
    public List<User> getMatches(Long currentUserId) {
        List<Long> usersWhoLikedYou = interactionRepository.findBySwipedIdAndAction(currentUserId, "like").stream()
                .map(Interaction::getSwiperId)
                .collect(Collectors.toList());

        List<Long> usersYouLiked = interactionRepository.findBySwiperId(currentUserId).stream()
                .filter(interaction -> "like".equalsIgnoreCase(interaction.getAction()))
                .map(Interaction::getSwipedId)
                .collect(Collectors.toList());

        List<Long> matchIds = usersWhoLikedYou.stream()
                .filter(usersYouLiked::contains)
                .collect(Collectors.toList());

        return userRepository.findAllById(matchIds);
    }

    /**
     * Delete a user and all their images from storage.
     */
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getImages().forEach(image -> imageUploadService.deleteImage(image.getImageUrl()));

        userRepository.deleteById(userId);
    }

    /**
     * Update user password
     */
    public void updateUserPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Update profile image (replace all with one new image).
     */
    @Transactional
    public void updateProfileImage(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete old images from storage
        user.getImages().forEach(image -> imageUploadService.deleteImage(image.getImageUrl()));
        user.getImages().clear();

        // Upload and save new image
        String newImageUrl = imageUploadService.uploadFile(file);
        user.getImages().add(new UserImage(newImageUrl, user));

        userRepository.save(user);
    }
}
