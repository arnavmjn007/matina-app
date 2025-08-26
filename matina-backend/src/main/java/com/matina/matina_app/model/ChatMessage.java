package com.matina.matina_app.model;

import lombok.Data;

@Data // Lombok annotation for getters/setters
public class ChatMessage {
    private String content;
    private String senderId;
    private String recipientId;
}