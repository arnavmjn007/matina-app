package com.matina.matina_app.dto;

import com.matina.matina_app.model.ChatMessage;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageDTO {
    private Long id;
    private String content;
    private Long senderId;
    private Long recipientId;
    private LocalDateTime timestamp;

    public static ChatMessageDTO fromEntity(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setSenderId(message.getSender().getId());
        dto.setRecipientId(message.getRecipient().getId());
        dto.setTimestamp(message.getTimestamp());
        return dto;
    }
}