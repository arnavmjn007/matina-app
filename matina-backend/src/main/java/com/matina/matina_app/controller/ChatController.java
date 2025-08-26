package com.matina.matina_app.controller;

import com.matina.matina_app.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        // The topic will be unique for each pair of users.
        // e.g., /topic/messages/5-10 (for a chat between user 5 and user 10)
        String topic = "/topic/messages/" + chatMessage.getRecipientId();

        // Send the message to the recipient's topic
        messagingTemplate.convertAndSend(topic, chatMessage);
    }
}