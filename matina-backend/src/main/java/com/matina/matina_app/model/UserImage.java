package com.matina.matina_app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "user_images")
public class UserImage {
    // --- Getters and Setters ---
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    // No-argument constructor for JPA
    public UserImage() {}

    // Constructor for creating new instances
    public UserImage(String imageUrl, User user) {
        this.imageUrl = imageUrl;
        this.user = user;
    }

}