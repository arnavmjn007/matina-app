package com.matina.matina_app.repository;

import com.matina.matina_app.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional; // Add this import

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findBySenderIdAndRecipientIdOrRecipientIdAndSenderIdOrderByTimestampAsc(
            Long senderId1, Long recipientId1, Long senderId2, Long recipientId2);

    // --- ADD THIS NEW METHOD ---
    Optional<ChatMessage> findTopBySenderIdAndRecipientIdOrRecipientIdAndSenderIdOrderByTimestampDesc(
            Long senderId1, Long recipientId1, Long senderId2, Long recipientId2);
}