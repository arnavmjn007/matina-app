package com.matina.matina_app.model;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "interactions")
public class Interaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long swiperId;

    @Column(nullable = false)
    private Long swipedId;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public Interaction() {
        // No-argument constructor
    }

    public Interaction(Long swiperId, Long swipedId, String action) {
        this.swiperId = swiperId;
        this.swipedId = swipedId;
        this.action = action;
        this.timestamp = LocalDateTime.now();
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSwiperId() { return swiperId; }
    public void setSwiperId(Long swiperId) { this.swiperId = swiperId; }
    public Long getSwipedId() { return swipedId; }
    public void setSwipedId(Long swipedId) { this.swipedId = swipedId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}