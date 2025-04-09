package com.traveloo.wearosapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import org.json.JSONObject;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

public class WebSocketManager {

    private static final OkHttpClient client = new OkHttpClient();
    private static WebSocket webSocket;
    private static final String TAG = "WebSocket";
    private static final String SERVER_URL = "ws://192.168.0.45:8080/ws/heart";

    public static void connect(Context context) {
        Request request = new Request.Builder().url(SERVER_URL).build();

        webSocket = client.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onOpen(@NonNull WebSocket webSocket, @NonNull Response response) {
                Log.d(TAG, "✅ WebSocket 연결 성공");
            }

            @Override
            public void onMessage(@NonNull WebSocket webSocket, @NonNull String text) {
                Log.d(TAG, "서버로부터 메시지 수신: " + text);

                Log.d(TAG, "서버로부터 메시지 수신: " + text);

                if ("REVOKED".equals(text)) {
                    Log.w(TAG, "🚫 서버 승인 해제됨. 앱 초기화.");

                    SharedPreferences prefs = context.getSharedPreferences("prefs", Context.MODE_PRIVATE);
                    prefs.edit().remove("deviceId").apply(); // 저장된 deviceId 삭제

                    // 메인 화면 종료 후 등록 화면으로 이동
                    if (context instanceof Activity) {
                        Activity activity = (Activity) context;
                        activity.runOnUiThread(() -> {
                            Intent intent = new Intent(activity, RegisterActivity.class);
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                            activity.startActivity(intent);
                        });
                    }

                    close(); // 소켓 종료
                }

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

    public static void send(String message) {
        if (webSocket != null) webSocket.send(message);
    }

    public static void close() {
        if (webSocket != null) webSocket.close(1000, "종료");
    }

}
