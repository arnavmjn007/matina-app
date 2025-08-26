package com.matina.matina_app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@Table(name = "user_images")
public class UserImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String imageUrl;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude // <-- THIS IS THE CRITICAL FIX
    private User user;

    public UserImage(String imageUrl, User user) {
        this.imageUrl = imageUrl;
        this.user = user;
    }
}