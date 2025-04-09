package com.traveloo.server.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class HeartRateWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Map<String, WebSocketSession> sessionMap = new ConcurrentHashMap<>();

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("연결됨: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
       try {
           JsonNode node = objectMapper.readTree(message.getPayload());
           // 1️⃣ 기기 등록 메시지인 경우
           if (node.has("deviceId")) {
               String deviceId = node.get("deviceId").asText();
               sessionMap.put(deviceId, session);
               System.out.println("📌 deviceId 등록됨: " + deviceId);
               return;
           }

           // 2️⃣ 심박수 데이터인 경우
           if (node.has("heartRate")) {
               int heartRate = node.get("heartRate").asInt();
               String deviceId = node.has("deviceId") ? node.get("deviceId").asText() : "unknown";

               System.out.println("수신된 심박수: " + heartRate + " bpm (from " + deviceId + ")");
               redisTemplate.opsForValue().set(deviceId + ":heartRate", String.valueOf(heartRate));
           }
       } catch (Exception e) {
           System.err.println("JSON 파싱 오류: " + e.getMessage());
       }
    }

    // 승인 해제 시 서버에서 호출할 수 있도록 공개 메서드 추가
    public void sendUnauthorized(String deviceId) {
        WebSocketSession session = sessionMap.get(deviceId);
        if (session != null && session.isOpen()) {
            try {
                String payload = objectMapper.writeValueAsString(Map.of(
                        "type", "UNAUTHORIZED",
                        "message", "승인이 해제되었습니다. 다시 인증해주세요."
                ));
                session.sendMessage(new TextMessage(payload));
                System.out.println("🚫 승인 해제 메시지 전송됨: " + deviceId);
            } catch (Exception e) {
                System.err.println("❌ 승인 해제 전송 실패: " + e.getMessage());
            }
        }
    }


    public static void sendMessageToDevice(String deviceId, String message) {
        WebSocketSession session = sessionMap.get(deviceId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("연결 종료: " + session.getId());
        // 세션 제거
        sessionMap.values().removeIf(s -> s.getId().equals(session.getId()));
    }
}
