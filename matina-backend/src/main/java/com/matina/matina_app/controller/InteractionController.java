package com.matina.matina_app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.matina.matina_app.dto.SwipeRequest;
import com.matina.matina_app.services.InteractionService;

@RestController
@RequestMapping("/api/interactions")
@CrossOrigin(origins = "http://localhost:3000")
public class InteractionController {

    @Autowired
    private InteractionService interactionService;

    /**
     * Handles a swipe action (like or dislike) from a user.
     * @param swipeRequest A JSON object containing the swiper's ID, the swiped user's ID, and the action.
     * @return A JSON object indicating whether the swipe resulted in a match.
     */
    @PostMapping("/swipe")
    public ResponseEntity<?> handleSwipe(@RequestBody SwipeRequest swipeRequest) {
        boolean isMatch = interactionService.recordSwipe(
            swipeRequest.getSwiperId(),
            swipeRequest.getSwipedId(),
            swipeRequest.getAction()
        );
        
        // Return a simple JSON response, e.g., { "isMatch": true }
        return ResponseEntity.ok(Map.of("isMatch", isMatch));
    }
}