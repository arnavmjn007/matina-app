package com.matina.matina_app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

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

    public UserPersonality() {} // No-argument constructor

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getQ1_care() { return q1_care; }
    public void setQ1_care(String q1_care) { this.q1_care = q1_care; }
    public String getQ2_love() { return q2_love; }
    public void setQ2_love(String q2_love) { this.q2_love = q2_love; }
    public String getQ3_cute() { return q3_cute; }
    public void setQ3_cute(String q3_cute) { this.q3_cute = q3_cute; }
    public Integer getLove() { return love; }
    public void setLove(Integer love) { this.love = love; }
    public Integer getCare() { return care; }
    public void setCare(Integer care) { this.care = care; }
    public Integer getCute() { return cute; }
    public void setCute(Integer cute) { this.cute = cute; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}