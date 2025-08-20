package com.matina.matina_app.dto;

import lombok.Data;

@Data
public class SwipeRequest {
    private Long swiperId;
    private Long swipedId;
    private String action;
}