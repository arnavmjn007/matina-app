package com.matina.matina_app.controller;

import com.matina.matina_app.dto.ChatMessageDTO;
import com.matina.matina_app.model.ChatMessage;
import com.matina.matina_app.services.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    // This handles sending real-time messages
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageDTO chatMessageDTO) {
        // Save the message to the database
        ChatMessage savedMessage = chatService.saveMessage(new ChatMessage(), chatMessageDTO.getSenderId(), chatMessageDTO.getRecipientId());
        savedMessage.setContent(chatMessageDTO.getContent());

        // Create a DTO to send over WebSocket to avoid circular references
        ChatMessageDTO messageToSend = ChatMessageDTO.fromEntity(savedMessage);

        String topic = "/topic/messages/" + chatMessageDTO.getRecipientId();
        messagingTemplate.convertAndSend(topic, messageToSend);
    }

    // This handles fetching the chat history
    @GetMapping("/api/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(@PathVariable Long senderId, @PathVariable Long recipientId) {
        List<ChatMessageDTO> messages = chatService.findChatMessages(senderId, recipientId)
                .stream()
                .map(ChatMessageDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messages);
    }
}