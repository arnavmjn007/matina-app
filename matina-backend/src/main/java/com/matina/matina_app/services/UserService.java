package com.matina.matina_app.services;

import com.matina.matina_app.dto.LastMessageDTO;
import com.matina.matina_app.dto.LoginResponse;
import com.matina.matina_app.dto.MatchDTO;
import com.matina.matina_app.model.ChatMessage;
import com.matina.matina_app.model.Interaction;
import com.matina.matina_app.model.User;
import com.matina.matina_app.model.UserImage;
import com.matina.matina_app.repository.ChatMessageRepository;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final InteractionRepository interactionRepository;
    private final ChatMessageRepository chatMessageRepository; // For fetching last messages
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
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getUserProfile() != null) user.getUserProfile().setUser(user);
        if (user.getUserBasics() != null) user.getUserBasics().setUser(user);
        if (user.getUserPersonality() != null) user.getUserPersonality().setUser(user);

        if (files != null && !files.isEmpty()) {
            user.setImages(new ArrayList<>());
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String imageUrl = imageUploadService.uploadFile(file);
                    user.getImages().add(new UserImage(imageUrl, user));
                }
            }
        }
        return userRepository.save(user);
    }

    public LoginResponse loginUser(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwtToken = jwtService.generateToken(userDetails);
        return new LoginResponse(jwtToken, user);
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public List<User> getDiscoveryUsers(Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId).orElseThrow(() -> new RuntimeException("User not found"));
        String targetGender = "man".equalsIgnoreCase(currentUser.getUserProfile().getGender()) ? "woman" : "man";
        List<Long> swipedIds = interactionRepository.findBySwiperId(currentUserId).stream().map(Interaction::getSwipedId).collect(Collectors.toList());
        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .filter(user -> user.getUserProfile() != null && targetGender.equalsIgnoreCase(user.getUserProfile().getGender()))
                .filter(user -> !swipedIds.contains(user.getId()))
                .collect(Collectors.toList());
    }

    public List<User> getLikedUsers(Long currentUserId) {
        List<Long> likerIds = interactionRepository.findBySwipedIdAndAction(currentUserId, "like").stream().map(Interaction::getSwiperId).collect(Collectors.toList());
        List<Long> swipedOnIds = interactionRepository.findBySwiperId(currentUserId).stream().map(Interaction::getSwipedId).collect(Collectors.toList());
        List<Long> unswipedLikerIds = likerIds.stream().filter(id -> !swipedOnIds.contains(id)).collect(Collectors.toList());
        return userRepository.findAllById(unswipedLikerIds);
    }

    // Updated getMatches to return MatchDTOs with last message info
    public List<MatchDTO> getMatches(Long currentUserId) {
        List<Long> usersWhoLikedYou = interactionRepository.findBySwipedIdAndAction(currentUserId, "like").stream().map(Interaction::getSwiperId).collect(Collectors.toList());
        List<Long> usersYouLiked = interactionRepository.findBySwiperIdAndAction(currentUserId, "like").stream().map(Interaction::getSwipedId).collect(Collectors.toList());
        List<Long> matchIds = usersWhoLikedYou.stream().filter(usersYouLiked::contains).collect(Collectors.toList());
        List<User> matchedUsers = userRepository.findAllById(matchIds);

        return matchedUsers.stream().map(matchUser -> {
            Optional<ChatMessage> lastMessageOpt = chatMessageRepository
                    .findTopBySenderIdAndRecipientIdOrRecipientIdAndSenderIdOrderByTimestampDesc(
                            currentUserId, matchUser.getId(), currentUserId, matchUser.getId());
            LastMessageDTO lastMessageDTO = lastMessageOpt.map(LastMessageDTO::fromEntity).orElse(null);
            return new MatchDTO(matchUser, lastMessageDTO);
        }).collect(Collectors.toList());
    }

    @Transactional
    public User updateUser(Long userId, User updatedUserData) {
        User existingUser = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        existingUser.setFirstName(updatedUserData.getFirstName());
        existingUser.setLastName(updatedUserData.getLastName());
        if (updatedUserData.getUserProfile() != null) {
            existingUser.getUserProfile().setBio(updatedUserData.getUserProfile().getBio());
            existingUser.getUserProfile().setPhone(updatedUserData.getUserProfile().getPhone());
            existingUser.getUserProfile().setAddress(updatedUserData.getUserProfile().getAddress());
        }
        if (updatedUserData.getUserBasics() != null) {
            existingUser.setUserBasics(updatedUserData.getUserBasics());
            existingUser.getUserBasics().setUser(existingUser);
        }
        if (updatedUserData.getUserPersonality() != null) {
            existingUser.setUserPersonality(updatedUserData.getUserPersonality());
            existingUser.getUserPersonality().setUser(existingUser);
        }
        if (updatedUserData.getInterests() != null) {
            existingUser.getInterests().clear();
            existingUser.getInterests().addAll(updatedUserData.getInterests());
        }
        if (updatedUserData.getWantsTo() != null) {
            existingUser.getWantsTo().clear();
            existingUser.getWantsTo().addAll(updatedUserData.getWantsTo());
        }
        return userRepository.save(existingUser);
    }

    public void deleteUser(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.getImages().forEach(image -> imageUploadService.deleteImage(image.getImageUrl()));
            userRepository.deleteById(userId);
        });
    }

    public void updateUserPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void updateProfileImage(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.getImages().forEach(image -> imageUploadService.deleteImage(image.getImageUrl()));
        user.getImages().clear();
        String newImageUrl = imageUploadService.uploadFile(file);
        user.getImages().add(new UserImage(newImageUrl, user));
        userRepository.save(user);
    }
}