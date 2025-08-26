package com.matina.matina_app.repository;

import com.matina.matina_app.model.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InteractionRepository extends JpaRepository<Interaction, Long> {

    List<Interaction> findBySwiperId(Long swiperId);

    List<Interaction> findBySwipedIdAndAction(Long swipedId, String action);

    // --- ADD THIS NEW METHOD ---
    // This finds all swipes made BY a user for a specific action (e.g., "like").
    List<Interaction> findBySwiperIdAndAction(Long swiperId, String action);

    Optional<Object> findBySwiperIdAndSwipedIdAndAction(Long swipedId, Long swiperId, String like);
}