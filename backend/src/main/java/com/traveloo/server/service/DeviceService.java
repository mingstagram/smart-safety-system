package com.traveloo.server.service;

import com.traveloo.server.entity.DeviceBinding;
import com.traveloo.server.handler.HeartRateWebSocketHandler;
import com.traveloo.server.repository.DeviceBindingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceBindingRepository deviceBindingRepository;
    private final HeartRateWebSocketHandler webSocketHandler;

    public DeviceBinding registerOrFindDevice(String deviceId) {
        return deviceBindingRepository.findByDeviceId(deviceId)
                .map(device -> {
                    device.setLastSeen(LocalDateTime.now()); // 🔥 접속 시점 기록
                    return deviceBindingRepository.save(device);
                })
                .orElseGet(() -> {
                    DeviceBinding newDevice = DeviceBinding.builder()
                            .deviceId(deviceId)
                            .approved(false)
                            .createdAt(LocalDateTime.now())
                            .lastSeen(LocalDateTime.now()) // 신규 기기 등록 시도
                            .build();
                    return deviceBindingRepository.save(newDevice);
                });
    }

    public Optional<DeviceBinding> getDeviceByDeviceId(String deviceId) {
        return deviceBindingRepository.findByDeviceId(deviceId);
    }

    public List<DeviceBinding> findAllDevices() {
        return deviceBindingRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public DeviceBinding updateDeviceApproval(String deviceId, boolean approved) {
        DeviceBinding device  = deviceBindingRepository.findByDeviceId(deviceId)
                .orElseThrow(() -> new RuntimeException("기기를 찾을 수 없습니다: " + deviceId));
        device.setApproved(approved);

        // 승인 해제 된 경우 -> 소켓으로 알림 전송
        if (!approved) {
            device.setLastSeen(null); // ← 요거 추가!
            HeartRateWebSocketHandler.sendMessageToDevice(deviceId, "REVOKED");
        }

        return deviceBindingRepository.save(device);

    }

}
