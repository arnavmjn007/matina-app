package com.matina.matina_app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user_basics")
public class UserBasics {

    @Id
    private Long id;

    private String height;
    private String exercise;
    private String education;
    private String drinking;
    private String smoking;
    private String lookingFor;
    private String kids;
    private String starSign;
    private String politics;
    private String religion;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore
    private User user;
}