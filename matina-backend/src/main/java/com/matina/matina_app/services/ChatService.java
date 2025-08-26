package com.matina.matina_app.services;

import com.matina.matina_app.model.ChatMessage;
import com.matina.matina_app.model.User;
import com.matina.matina_app.repository.ChatMessageRepository;
import com.matina.matina_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;

    public ChatMessage saveMessage(ChatMessage chatMessage, Long senderId, Long recipientId) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = userRepository.findById(recipientId).orElseThrow(() -> new RuntimeException("Recipient not found"));

        chatMessage.setSender(sender);
        chatMessage.setRecipient(recipient);
        chatMessage.setTimestamp(LocalDateTime.now());
        return messageRepository.save(chatMessage);
    }

    public List<ChatMessage> findChatMessages(Long senderId, Long recipientId) {
        return messageRepository.findBySenderIdAndRecipientIdOrRecipientIdAndSenderIdOrderByTimestampAsc(
                senderId, recipientId, senderId, recipientId);
    }
}