package com.traveloo.wearosapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.util.Log;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

public class RegisterActivity extends Activity {

    private final String TAG = "RegisterActivity";
    private String deviceId;
    private Button sendButton;

    private static final String SERVER_URL = "http://192.168.0.45:8080/api/device/register";
    private static final String STATUS_URL = "http://192.168.0.45:8080/api/device/status/";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private final Handler handler = new Handler();
    private final int CHECK_INTERVAL_MS = 3000;

    private final OkHttpClient client = new OkHttpClient();

    private Runnable statusChecker;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        sendButton = findViewById(R.id.sendDeviceIdBtn);
        deviceId = Settings.Secure.getString(getContentResolver(), Settings.Secure.ANDROID_ID);

        sendButton.setOnClickListener(v -> sendDeviceId());
        WebSocketManager.connect(this);

    }

    private void sendDeviceId() {
        try {
            JSONObject json = new JSONObject();
            json.put("deviceId", deviceId);

            RequestBody body = RequestBody.create(json.toString(), JSON);
            Request request = new Request.Builder()
                    .url(SERVER_URL)
                    .post(body)
                    .build();

            OkHttpClient client = new OkHttpClient();
            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(@NonNull Call call, @NonNull IOException e) {
                    Log.e(TAG, "등록 실패: " + e.getMessage());
                    runOnUiThread(() ->
                            Toast.makeText(RegisterActivity.this, "서버 연결 실패", Toast.LENGTH_SHORT).show());
                }

                @Override
                public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                    if (!response.isSuccessful()) {
                        Log.e(TAG, "서버 응답 오류: " + response.code());
                        runOnUiThread(() ->
                                Toast.makeText(RegisterActivity.this, "등록 실패: 서버 오류", Toast.LENGTH_SHORT).show());
                        return;
                    }

                    String resBody = response.body().string();
                    Log.d(TAG, "서버 응답: " + resBody);

                    try {
                        JSONObject resJson = new JSONObject(resBody);
                        String status = resJson.getString("status");

                        // 저장
                        getSharedPreferences("prefs", MODE_PRIVATE)
                                .edit()
                                .putString("deviceId", deviceId)
                                .apply();

                        runOnUiThread(() -> {
                            if (status.equals("APPROVED")) {
                                Toast.makeText(RegisterActivity.this, "✅ 기기 등록 완료", Toast.LENGTH_SHORT).show();
                                moveToMain();
                            } else {
                                Toast.makeText(RegisterActivity.this, "승인 대기 중입니다.", Toast.LENGTH_LONG).show();
                                sendButton.setEnabled(false);
                                sendButton.setText("승인 대기 중...");
                                startApprovalCheck();
                            }
                        });

                    } catch(Exception e) {
                        Log.e(TAG, "JSON 파싱 오류: " + e.getMessage());
                    }

                }
            });
        } catch (Exception e) {
            Log.e(TAG, "JSON 생성 오류: " + e.getMessage());
        }

    }

    private void startApprovalCheck() {
        statusChecker = new Runnable() {
            @Override
            public void run() {
                String statusUrl = STATUS_URL + deviceId;

                Request request = new Request.Builder()
                        .url(statusUrl)
                        .get()
                        .build();

                client.newCall(request).enqueue(new Callback() {
                    @Override
                    public void onFailure(@NonNull Call call, @NonNull IOException e) {
                        Log.e(TAG, "승인 확인 실패: " + e.getMessage());
                        handler.postDelayed(statusChecker, CHECK_INTERVAL_MS); // 다시 시도
                    }

                    @Override
                    public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                        if (!response.isSuccessful()) {
                            Log.e(TAG, "서버 응답 오류: " + response.code());
                            handler.postDelayed(statusChecker, CHECK_INTERVAL_MS);
                            return;
                        }

                        String resBody = response.body().string();
                        Log.d(TAG, "승인 상태 응답: " + resBody);

                        try {
                            JSONObject resJson = new JSONObject(resBody);
                            String status = resJson.getString("status");

                            if ("APPROVED".equals(status)) {
                                runOnUiThread(() -> {
                                    moveToMain();
                                });
                            } else {
                                handler.postDelayed(statusChecker, CHECK_INTERVAL_MS);
                            }

                        } catch (Exception e) {
                            Log.e(TAG, "JSON 파싱 오류: " + e.getMessage());
                            handler.postDelayed(statusChecker, CHECK_INTERVAL_MS);
                        }

                    }
                });

            }
        };
        handler.postDelayed(statusChecker, CHECK_INTERVAL_MS);
    }


    private void moveToMain() {
        handler.removeCallbacks(statusChecker);
        Toast.makeText(this, "승인 완료!", Toast.LENGTH_SHORT).show();
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
//        WebSocketManager.close();
    }
}
