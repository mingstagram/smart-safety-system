# 🚀  스마트 안전관리 시스템

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-green?style=flat)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6.1.4-blue?style=flat)
![Spring Data JPA](https://img.shields.io/badge/Spring%20Data%20JPA-3.2.3-blue?style=flat)
![MariaDB](https://img.shields.io/badge/MariaDB-3.3.2-blue?style=flat)
![Redis](https://img.shields.io/badge/Redis-7.0-red?style=flat)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat)
![Material-UI](https://img.shields.io/badge/Material%20UI-7.0.1-blue?style=flat)
![Wear OS](https://img.shields.io/badge/Wear%20OS-4.0-green?style=flat)

## 📌 프로젝트 개요
스마트 안전관리 시스템은 사용자의 건강 상태와 위치를 실시간으로 모니터링하고 관리하는 플랫폼입니다. 웨어러블 디바이스를 통해 사용자의 건강 데이터를 수집하고, 관리자 대시보드를 통해 실시간 모니터링 및 관리가 가능합니다.

---

## ✅ 주요 목표
- 실시간 건강 데이터 모니터링 (심박수, ECG, 위치)
- 웨어러블 디바이스와의 연동
- 관리자 대시보드를 통한 사용자 관리
- 안전 관리 시스템 구축

---

## 📌 기술 스택

### Backend (Spring Boot)
- Java 17
- Spring Boot 3.2.3
- Spring Security 6.1.4
- Spring Data JPA 3.2.3
- Spring WebSocket
- MariaDB 3.3.2
- Redis
- JWT 0.11.5

### Frontend (React)
- React 19.1.0
- Material-UI 7.0.1
- React Router 6.30.0
- Axios 1.8.4
- Recharts 2.15.2
- React Leaflet 5.0.0

### WearOS App
- Android Wear OS (minSdk 30)
- Google Play Services 19.0.0
- OkHttp 4.12.0
- WebSocket

---

## 📌 시스템 구성

1. **Backend Service**
   - 사용자 인증/인가 (JWT)
   - 건강 데이터 처리
   - 실시간 데이터 스트리밍 (WebSocket)
   - 데이터베이스 관리 (MariaDB, Redis)

2. **Frontend Service**
   - 관리자 대시보드
   - 사용자 관리
   - 실시간 모니터링
   - 데이터 시각화 (Recharts, Leaflet)

3. **WearOS App**
   - 건강 데이터 수집
   - 실시간 데이터 전송 (WebSocket)
   - 사용자 알림

---

## 📌 주요 기능
- 실시간 심박수 모니터링
- ECG 데이터 시각화
- GPS 기반 위치 추적
- 사용자 관리 (CRUD)
- 관리자 권한 관리
- 실시간 알림 시스템

---

## 📌 설치 및 실행 방법

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### WearOS App
1. Android Studio에서 프로젝트 열기
2. Wear OS 에뮬레이터 또는 실제 디바이스 연결
3. 앱 실행

---

## 📌 개발 환경
- Java 17
- Node.js 18+
- Android Studio
- MariaDB 3.3.2
- Redis 7.0

---

## 📌 Contact
#### ✉️ Email: amgkim21@gmail.com
#### 📌 GitHub: [github.com/mingstagram](https://github.com/mingstagram)
#### 📌 Tech Blog: [mingucci.tistory.com](https://mingucci.tistory.com)