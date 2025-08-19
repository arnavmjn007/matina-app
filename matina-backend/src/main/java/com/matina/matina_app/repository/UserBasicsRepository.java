package com.matina.matina_app.repository;

import com.matina.matina_app.model.UserBasics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBasicsRepository extends JpaRepository<UserBasics, Long> {
}