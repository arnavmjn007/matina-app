package com.matina.matina_app.model;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "interactions")
public class Interaction {
    // --- Getters and Setters ---
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

    // No-argument constructor for JPA
    public Interaction() {}

    // Constructor for creating new instances
    public Interaction(Long swiperId, Long swipedId, String action) {
        this.swiperId = swiperId;
        this.swipedId = swipedId;
        this.action = action;
        this.timestamp = LocalDateTime.now();
    }

}
