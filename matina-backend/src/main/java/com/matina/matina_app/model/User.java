package com.matina.matina_app.model;

import jakarta.persistence.*;
import lombok.Data; // Import Lombok's @Data
import java.util.List;

@Data // Creates all getters, setters, toString, etc.
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
    private String phone;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private UserProfile userProfile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private UserBasics userBasics;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private UserPersonality userPersonality;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_interests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "interest")
    private List<String> interests;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_wants_to", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "wants")
    private List<String> wantsTo;
}