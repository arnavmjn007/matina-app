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
@Table(name = "user_personality")
public class UserPersonality {
    @Id
    private Long id;
    private String q1_care;
    private String q2_love;
    private String q3_cute;
    private Integer love;
    private Integer care;
    private Integer cute;
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore
    @ToString.Exclude // <-- THIS IS THE CRITICAL FIX
    private User user;
}