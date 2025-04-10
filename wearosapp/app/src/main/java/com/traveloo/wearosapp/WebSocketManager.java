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
        if (webSocket != null) {
            webSocket.close(1000, "Reconnect");
        }
        Request request = new Request.Builder().url(SERVER_URL).build();

        webSocket = client.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onOpen(@NonNull WebSocket webSocket, @NonNull Response response) {
                Log.d(TAG, "✅ WebSocket 연결 성공");

                // ✅ deviceId 등록 메시지 전송
                SharedPreferences prefs = context.getSharedPreferences("prefs", Context.MODE_PRIVATE);
                String deviceId = prefs.getString("deviceId", null);
                if (deviceId != null) {
                    JSONObject json = new JSONObject();
                    try {
                        json.put("deviceId", deviceId);
                        Log.d(TAG, "📤 deviceId 전송: " + json.toString());
                        send(json.toString()); // 서버에 deviceId 등록
                    } catch (Exception e) {
                        Log.e(TAG, "deviceId 전송 실패: " + e.getMessage());
                    }
                }

            }

            @Override
            public void onMessage(@NonNull WebSocket webSocket, @NonNull String text) {
                Log.d(TAG, "서버로부터 메시지 수신: " + text);

                if ("REVOKED".equals(text)) {
                    Log.w(TAG, "🚫 서버 승인 해제됨. 앱 초기화.");

                    SharedPreferences prefs = context.getSharedPreferences("prefs", Context.MODE_PRIVATE);
                    prefs.edit().remove("deviceId").apply();

                    if (context instanceof Activity) {
                        Activity activity = (Activity) context;
                        activity.runOnUiThread(() -> {
                            Toast.makeText(context, "인증이 해제되었습니다.", Toast.LENGTH_LONG).show();
                            Intent intent = new Intent(activity, RegisterActivity.class);
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                            activity.startActivity(intent);
                        });
                    }
                }

                if ("APPROVED".equals(text)) {
                    Log.i(TAG, "✅ 서버에서 승인 완료 수신");

                    if (context instanceof RegisterActivity) {
                        ((Activity) context).runOnUiThread(() -> {
                            Toast.makeText(context, "승인이 완료되었습니다!", Toast.LENGTH_SHORT).show();
                            context.startActivity(new Intent(context, MainActivity.class));
                            ((Activity) context).finish();
                        });
                    }
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
