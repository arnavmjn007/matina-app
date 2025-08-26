package com.matina.matina_app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

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

    public UserBasics() {} // No-argument constructor

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getHeight() { return height; }
    public void setHeight(String height) { this.height = height; }
    public String getExercise() { return exercise; }
    public void setExercise(String exercise) { this.exercise = exercise; }
    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }
    public String getDrinking() { return drinking; }
    public void setDrinking(String drinking) { this.drinking = drinking; }
    public String getSmoking() { return smoking; }
    public void setSmoking(String smoking) { this.smoking = smoking; }
    public String getLookingFor() { return lookingFor; }
    public void setLookingFor(String lookingFor) { this.lookingFor = lookingFor; }
    public String getKids() { return kids; }
    public void setKids(String kids) { this.kids = kids; }
    public String getStarSign() { return starSign; }
    public void setStarSign(String starSign) { this.starSign = starSign; }
    public String getPolitics() { return politics; }
    public void setPolitics(String politics) { this.politics = politics; }
    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}