package com.traveloo.wearosapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class LauncherActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String deviceId = getSharedPreferences("prefs", MODE_PRIVATE)
                .getString("deviceId", null);

        if (deviceId == null) {
            startActivity(new Intent(this, RegisterActivity.class));
        } else {
            startActivity(new Intent(this, MainActivity.class));
        }

        finish(); // 런처 액티비티 종료
    }
}
