package com.matina.matina_app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.matina.matina_app.model.Interaction;
import com.matina.matina_app.repository.InteractionRepository;

@Service
public class InteractionService {

    @Autowired
    private InteractionRepository interactionRepository;

    public boolean recordSwipe(Long swiperId, Long swipedId, String action) {
        Interaction interaction = new Interaction(swiperId, swipedId, action);
        interactionRepository.save(interaction);

        if ("like".equalsIgnoreCase(action)) {
            return interactionRepository
                .findBySwiperIdAndSwipedIdAndAction(swipedId, swiperId, "like")
                .isPresent();
        }
        return false;
    }
}