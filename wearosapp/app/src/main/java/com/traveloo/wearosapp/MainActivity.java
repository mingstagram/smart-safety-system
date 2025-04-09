package com.traveloo.wearosapp;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorManager;
import android.hardware.SensorEventListener;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.widget.TextView;

import com.traveloo.wearosapp.R;

import java.util.Random;

public class MainActivity extends Activity {

    private SensorManager sensorManager;
    private Sensor heartRateSensor;
    private TextView heartRateText;
    private final String TAG = "HeartRate";
    private final Handler handler = new Handler();
    private final Random random = new Random();

    private boolean useDummy = false; // 더미 데이터 사용 여부

    private boolean sensorResponded = false; // 센서 응답 여부 추적
    private String deviceId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // SharedPreferences에서 기기 ID 확인
        SharedPreferences prefs = getSharedPreferences("prefs", MODE_PRIVATE);
        deviceId = prefs.getString("deviceId", null);

        if(deviceId == null) {
            finish(); // 등록 안됐으면 종료
            return;
        }

        setContentView(R.layout.activity_main); // 레이아웃 연결

        WebSocketManager.connect(this);

        // 1. TextView 연결 (화면에 보여줄 용도)
        heartRateText = findViewById(R.id.heartRateText);

        // 2. SensorManager 초기화
        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);

        // 3. 심박수 센서 가져오기
        heartRateSensor = sensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE);

        // 4. 센서 리스너 등록
        if (heartRateSensor != null) {
            sensorManager.registerListener(sensorEventListener, heartRateSensor, SensorManager.SENSOR_DELAY_NORMAL);

            // ⏱ 5초 후에도 센서 응답 없으면 → 더미 시작
            handler.postDelayed(() -> {
                if (!sensorResponded) {
                    Log.d(TAG, "❌ 센서 응답 없음 → 더미로 전환");
                    useDummy = true;
                    sensorManager.unregisterListener(sensorEventListener);
                    handler.post(heartRateSimulator);
                }
            }, 5000);
        } else {
            Log.d(TAG, "❌ 센서 없음 → 더미 시작");
            useDummy = true;
            handler.post(heartRateSimulator);
        }

    }

    // 5. 센서 값이 바뀔 때마다 호출되는 리스너
    private final SensorEventListener sensorEventListener = new SensorEventListener() {
        @Override
        public void onSensorChanged(SensorEvent event) {
            if(event.sensor.getType() == Sensor.TYPE_HEART_RATE) {
                sensorResponded = true;
                float heartRate = event.values[0];
                heartRateText.setText("심박수 : " + heartRate + " bpm");
                Log.d(TAG, "현재 심박수: " + heartRate);
                sendHeartRate((int) heartRate);
            }
        }

        @Override
        public void onAccuracyChanged(Sensor sensor, int i) {
            // 정확도 변경 시 처리 (생략 가능)
        }
    };

    // 더미 데이터 생성 루틴
    private final Runnable heartRateSimulator = new Runnable() {
        @Override
        public void run() {
            int fakeBpm = 60 + random.nextInt(61);
            heartRateText.setText("심박수: " + fakeBpm + " bpm");
            Log.d(TAG, "더미 심박수: " + fakeBpm);
            sendHeartRate(fakeBpm);
            handler.postDelayed(this, 5000);
        }
    };

    // WebSocket 전송
    private void sendHeartRate(int bpm) {
        String json = "{ \"deviceId\": \"" + deviceId + "\", \"heartRate\": " + bpm + " }";
        WebSocketManager.send(json);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if(sensorManager != null && !useDummy) {
            // 센서 리스너 해제
            sensorManager.unregisterListener(sensorEventListener);
        } else {
            handler.removeCallbacks(heartRateSimulator);
        }

        WebSocketManager.close();
    }
}
