package com.matina.matina_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the endpoint your React client will connect to.
        // `withSockJS()` provides a fallback for browsers that don't support WebSockets.
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3000").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // These are the "mailboxes" or "topics" that messages will be sent to.
        // Your server will send messages to destinations starting with "/topic".
        registry.enableSimpleBroker("/topic");

        // This is the prefix for the endpoints that your client will send messages to.
        // e.g., a message sent from React will go to a destination like "/app/chat.sendMessage".
        registry.setApplicationDestinationPrefixes("/app");
    }
}