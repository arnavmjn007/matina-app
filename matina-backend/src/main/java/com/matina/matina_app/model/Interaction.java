package com.matina.matina_app.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "interactions")
@NoArgsConstructor
public class Interaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long swiperId; // The ID of the user swiping

    @Column(nullable = false)
    private Long swipedId; // The ID of the user being swiped on

    @Column(nullable = false)
    private String action; // "like" or "dislike"

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public Interaction(Long swiperId, Long swipedId, String action) {
        this.swiperId = swiperId;
        this.swipedId = swipedId;
        this.action = action;
        this.timestamp = LocalDateTime.now();
    }
}