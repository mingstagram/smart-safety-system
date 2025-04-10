# 📐 프로젝트 아키텍처 설계 개요

본 프로젝트는 Wear OS 기반 스마트워치에서 실시간 심박수를 측정하고, WebSocket을 통해 Spring Boot 서버로 전송하여 관리자가 승인 여부를 판단할 수 있는 구조로 설계되어 있습니다.

---

## 🧩 구성 요소

### 1. Wear OS 앱 (Android)
- **역할**: 기기 등록, 승인 여부 확인, 실시간 심박수 측정 및 전송
- **주요 화면**
    - `SplashActivity`: 기기 등록 여부 및 승인 상태 확인
    - `RegisterActivity`: 기기 ID 등록 및 승인 대기
    - `MainActivity`: 심박수 측정 및 WebSocket 전송

- **기술 스택**: Java, OkHttp, SensorManager, WebSocket

---

### 2. Spring Boot 서버
- **역할**: 기기 등록 상태 관리, 승인 여부 처리, WebSocket 수신 및 승인 해제 알림 전송
- **API**
    - `POST /api/device/register` – 기기 ID 등록
    - `GET /api/device/status/{deviceId}` – 승인 상태 조회
    - `PUT /api/device/approve` – 관리자 승인/해제 처리
    - `GET /api/device/all` – 전체 디바이스 조회

- **WebSocket Endpoint**
    - `/ws/heart`: 심박수 수신 및 승인 해제 메시지 전달

- **기술 스택**: Spring Boot Web, WebSocket, Redis, JPA (MariaDB)

---

### 3. 관리자 React 웹 대시보드
- **역할**: 등록된 기기 리스트 확인 및 승인/해제 처리
- **기술 스택**: React, Axios, MUI

--- 

## 📡 WebSocket 흐름

1. 앱에서 WebSocket 연결 (`/ws/heart`)
2. 서버에 `{ deviceId }` 전송 → 세션 맵핑
3. 이후 `{ heartRate, deviceId }` 주기적 전송
4. 서버에서 Redis 저장 및 승인 해제 시 `REVOKED` 메시지 전송

---

## 🧠 DB 설계

### 📌 device_bindings 테이블

| 필드명       | 타입         | 설명               |
|--------------|--------------|--------------------|
| id           | Long         | PK                 |
| device_id    | String       | 기기 고유 ID       |
| approved     | Boolean      | 관리자 승인 여부   |
| created_at   | LocalDateTime| 등록 시간          |
| last_seen    | LocalDateTime| 마지막 통신 시각   |

---

## 🔐 인증 흐름 요약

1. 앱에서 `deviceId` 등록 요청
2. 서버는 기기를 저장 후 `APPROVED` or `PENDING` 반환
3. 관리자 승인 시, 앱에서 MainActivity로 이동
4. 승인 해제 시 `REVOKED` 메시지로 앱에서 RegisterActivity로 리다이렉트

---

## ✅ 향후 확장 포인트

- GPS 기반 위치 정보 추가
- 관리자 알림 시스템 (슬랙, 이메일 등)
- 심박수 임계치 경보 기능
- 사용자 로그인 및 계정 연결 기능 