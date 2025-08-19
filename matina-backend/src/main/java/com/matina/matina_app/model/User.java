package com.matina.matina_app.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data // Lombok annotation to generate getters, setters, etc.
@Entity
@Table(name = "users") // This must match your table name in MySQL
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Date birthday;
    private String gender;
    private String address;
    private String phone;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    // For simplicity, we'll store lists as comma-separated strings
    private String interests; 
    private String wantsTo;

    private String profileImageUrl;

    // These will be calculated
    private int love;
    private int care;
    private int cute;

    // You can add more fields for basics and personality if needed
}