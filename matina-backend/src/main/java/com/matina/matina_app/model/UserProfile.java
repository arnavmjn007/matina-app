package com.matina.matina_app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDate;

@Getter
@Setter
@ToString
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
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore
    @ToString.Exclude // <-- THIS IS THE CRITICAL FIX
    private User user;
}