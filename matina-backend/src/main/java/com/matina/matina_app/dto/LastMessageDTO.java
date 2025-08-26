package com.matina.matina_app.dto;

import com.matina.matina_app.model.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LastMessageDTO {
    private String content;
    private Long senderId;

    public static LastMessageDTO fromEntity(ChatMessage message) {
        return new LastMessageDTO(message.getContent(), message.getSender().getId());
    }
}