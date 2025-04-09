package com.traveloo.wearosapp;


import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.Nullable;

import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class SplashActivity extends Activity {

    private final String TAG = "SplashActivity";
    private final String STATUS_URL = "http://192.168.0.45:8080/api/device/status/";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String savedDeviceId = getSharedPreferences("prefs", MODE_PRIVATE)
                .getString("deviceId", null);

        if (savedDeviceId == null) {
            // 기기 ID가 없으면 → 등록 화면으로 이동
            startActivity(new Intent(this, RegisterActivity.class));
            finish();
            return;
        }

        checkApprovalStatus(savedDeviceId);
    }

    private void checkApprovalStatus(String deviceId) {
        String url = STATUS_URL + deviceId;

        Request request = new Request.Builder().url(url).build();
        OkHttpClient client = new OkHttpClient();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e(TAG, "서버 확인 실패: " + e.getMessage());
                goToRegister();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (!response.isSuccessful()) {
                    Log.e(TAG, "응답 오류: " + response.code());
                    goToRegister();
                    return;
                }

                String body = response.body().string();
                try {
                    JSONObject json = new JSONObject(body);
                    String status = json.getString("status");

                    if ("APPROVED".equals(status)) {
                        goToMain();
                    } else {
                        goToRegister();
                    }
                } catch (Exception e) {
                    Log.e(TAG, "파싱 오류: " + e.getMessage());
                    goToRegister();
                }
            }
        });
    }

    private void goToMain() {
        runOnUiThread(() -> {
            startActivity(new Intent(this, MainActivity.class));
            finish();
        });
    }

    private void goToRegister() {
        runOnUiThread(() -> {
            startActivity(new Intent(this, RegisterActivity.class));
            finish();
        });
    }
}