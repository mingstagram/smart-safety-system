
# 📡 데이터 흐름 설계서

본 문서는 Wear OS 앱과 Spring Boot 서버, React 관리자 페이지 간의 전체 데이터 흐름을 설명합니다.

---

## 🔄 데이터 흐름

### 1. 📲 Wear OS 앱 → 서버: 기기 등록 요청
- **타이밍**: 앱 실행 후 최초
- **방식**: `POST /api/device/register`
- **요청 데이터**:
  ```json
  { "deviceId": "b1900229c9b3ae95" }
  ```
- **서버 응답**:  
  `{"status": "PENDING"}` 또는 `{"status": "APPROVED"}`

---

### 2. 🖥️ 서버: 기기 상태 저장 및 응답 처리
- **DB 저장**: `device_bindings` 테이블에 등록 또는 갱신
- **상태 판별**:
    - 최초 등록 시 → `PENDING`
    - 이미 승인된 경우 → `APPROVED`

---

### 3. ⏳ Wear OS 앱: 승인 상태 확인
- **PENDING**: 승인 대기 화면 유지 + 주기적 상태 체크 (`/api/device/status/{deviceId}`)
- **APPROVED**: `MainActivity`로 이동 → WebSocket 연결 시작

---

### 4. 🧑‍💻 React 관리자 페이지: 기기 승인 관리
- **기능**:
    - 등록된 기기 목록 조회
    - 승인/승인해제 토글
- **API**: `PUT /api/device/approve`
- **화면 갱신**: 승인 상태 / 앱 등록 상태(📡 or 📴)

---

### 5. 🔌 WebSocket 연결 및 기기 식별
- **연결 시점**: `MainActivity` 진입 시 앱에서 연결
- **초기 메시지**:
  ```json
  { "deviceId": "b1900229c9b3ae95" }
  ```
- **서버 매핑**: `deviceId ↔ WebSocketSession` 저장

---

### 6. ❤️ 실시간 심박수 전송
- **전송 형식**:
  ```json
  { "deviceId": "b1900229c9b3ae95", "heartRate": 78 }
  ```
- **주기**: 5초마다 (센서 또는 더미 시뮬레이션)

---

### 7. 🚫 서버 → 앱: 승인 해제 메시지 전송
- **관리자가 승인 해제 시**:
    - 서버는 `"REVOKED"` 또는 `"UNAUTHORIZED"` 메시지를 WebSocket으로 전송
- **앱 반응**:
    - `SharedPreferences`에서 `deviceId` 삭제
    - `RegisterActivity`로 이동하여 재등록 유도

