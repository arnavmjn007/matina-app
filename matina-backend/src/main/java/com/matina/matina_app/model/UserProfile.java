package com.matina.matina_app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    private Long id;

    private LocalDate birthday;
    private String gender;

    @Column(length = 1000)
    private String bio;
    
    private String profileImageUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore // Prevents infinite loops when sending JSON responses
    private User user;
}