package com.matina.matina_app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.matina.matina_app.model.Interaction;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    List<Interaction> findBySwiperId(Long swiperId);
    List<Interaction> findBySwipedIdAndAction(Long swipedId, String action);
    Optional<Interaction> findBySwiperIdAndSwipedIdAndAction(Long swiperId, Long swipedId, String action);
}