package com.matina.matina_app.repository;

import com.matina.matina_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This method will find a user by their email address.
    // Spring Data JPA automatically creates the query for you based on the method name.
    Optional<User> findByEmail(String email);
}
