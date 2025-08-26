package com.matina.matina_app.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    private String firstName;
    private String lastName;

    // FIX: Set fetch type to EAGER to load data immediately
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private UserProfile userProfile;

    // FIX: Set fetch type to EAGER
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private UserBasics userBasics;

    // FIX: Set fetch type to EAGER
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private UserPersonality userPersonality;

    // FIX: Set fetch type to EAGER
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<UserImage> images = new ArrayList<>();

    // FIX: Set fetch type to EAGER
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_interests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "interest")
    private List<String> interests;

    // FIX: Set fetch type to EAGER
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_wants_to", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "wants")
    private List<String> wantsTo;
}