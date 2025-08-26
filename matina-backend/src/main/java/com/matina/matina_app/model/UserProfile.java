package com.matina.matina_app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    private Long id;

    private LocalDate birthday;
    private String gender;
    private String phone;
    private String address;

    @Column(length = 1000)
    private String bio;

    // The old single image URL is removed from this file.

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore
    private User user;
}