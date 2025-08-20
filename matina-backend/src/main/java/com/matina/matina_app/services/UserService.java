package com.matina.matina_app.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.matina.matina_app.model.Interaction;
import com.matina.matina_app.model.User;
import com.matina.matina_app.repository.InteractionRepository;
import com.matina.matina_app.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InteractionRepository interactionRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        } else {
            throw new IllegalArgumentException("Invalid credentials provided.");
        }
    }

    // --- NEW METHODS FOR DISCOVERY, LIKES, AND MATCHES ---
    /**
     * Finds potential users for the discovery page. It filters by the opposite
     * gender and excludes the current user and anyone they've already swiped.
     */
    public List<User> getDiscoveryUsers(Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        String currentUserGender = currentUser.getUserProfile().getGender();
        String targetGender = "man".equalsIgnoreCase(currentUserGender) ? "woman" : "man";

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
        return userRepository.findAllById(likerIds);
    }

    public List<User> getMatches(Long currentUserId) {
        List<Long> usersWhoLikedYou = interactionRepository.findBySwipedIdAndAction(currentUserId, "like").stream()
                .map(Interaction::getSwiperId)
                .collect(Collectors.toList());

        // Corrected logic is here
        List<Long> usersYouLiked = interactionRepository.findBySwiperId(currentUserId).stream()
                .filter(interaction -> "like".equalsIgnoreCase(interaction.getAction()))
                .map(Interaction::getSwipedId)
                .collect(Collectors.toList());

        List<Long> matchIds = usersWhoLikedYou.stream()
                .filter(usersYouLiked::contains)
                .collect(Collectors.toList());

        return userRepository.findAllById(matchIds);
    }
}
