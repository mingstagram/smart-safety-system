plugins {
    id("com.android.application")
}

android {
    namespace = "com.traveloo.wearosapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.traveloo.wearosapp"
        minSdk = 30
        versionCode = 1
        versionName = "1.0"

    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation("com.google.android.gms:play-services-wearable:19.0.0")
    implementation("androidx.percentlayout:percentlayout:1.0.0")
    implementation("androidx.legacy:legacy-support-v4:1.0.0")
    implementation("androidx.recyclerview:recyclerview:1.3.1") // ✅ 안정 버전
    implementation("androidx.wear:wear:1.2.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0") // ✅ WebSocket 라이브러리
}