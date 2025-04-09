package com.traveloo.server.config.websocket;

import com.traveloo.server.handler.HeartRateWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final HeartRateWebSocketHandler handler;

    // 💡 생성자 주입
    public WebSocketConfig(HeartRateWebSocketHandler handler) {
        this.handler = handler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/ws/heart")
                .setAllowedOrigins("*"); // 실제 운영에선 도메인 지정 필요
    }
}
