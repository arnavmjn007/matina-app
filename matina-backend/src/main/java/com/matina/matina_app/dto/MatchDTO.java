package com.matina.matina_app.dto;

import com.matina.matina_app.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchDTO {
    private User user;
    private LastMessageDTO lastMessage;
}