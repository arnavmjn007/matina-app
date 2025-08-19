package com.matina.matina_app.repository;

import com.matina.matina_app.model.UserPersonality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPersonalityRepository extends JpaRepository<UserPersonality, Long> {
}