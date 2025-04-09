package com.traveloo.wearosapp;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

public class HeartRateWebSocketClient {

    private final OkHttpClient client = new OkHttpClient();
    private WebSocket webSocket;
    private final String TAG = "WebSocket";

    // WebSocket 서버 주소 (예시: Spring 서버의 ws 엔드포인트)
    private final String SERVER_URL = "ws://192.168.0.45:8080/ws/heart";

    public void connect() {
        Request request = new Request.Builder().url(SERVER_URL).build();

        webSocket = client.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onOpen(@NonNull WebSocket webSocket, @NonNull Response response) {
                Log.d(TAG, "✅ WebSocket 연결 성공");
            }

            @Override
            public void onMessage(@NonNull WebSocket webSocket, @NonNull String text) {
                Log.d(TAG, "서버로부터 메시지 수신: " + text);
            }

            @Override
            public void onFailure(@NonNull WebSocket webSocket, @NonNull Throwable t, Response response) {
                Log.e(TAG, "❌ WebSocket 연결 실패: " + t.getMessage());
            }

            @Override
            public void onClosed(@NonNull WebSocket webSocket, int code, @NonNull String reason) {
                Log.d(TAG, "WebSocket 연결 종료: " + reason);
            }
        });
    }

    // 심박수 데이터 전송
    public void sendHeartRate(int heartRate) {
        if (webSocket != null) {
            String json = "{ \"heartRate\": " + heartRate + " }"; // 단순 JSON 포맷
            webSocket.send(json);
            Log.d(TAG, "전송한 심박수: " + json);
        }
    }

    public void disconnect() {
        if(webSocket != null) {
            webSocket.close(1000, "앱 종료로 연결 해제");
        }
    }


}
