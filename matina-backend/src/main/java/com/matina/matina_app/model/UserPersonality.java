package com.matina.matina_app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
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
    private User user;
}