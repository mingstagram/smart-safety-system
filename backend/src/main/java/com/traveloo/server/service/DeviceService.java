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
                .orElseGet(() -> {
                    DeviceBinding newDevice = DeviceBinding.builder()
                            .deviceId(deviceId)
                            .approved(false)
                            .createdAt(LocalDateTime.now())
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
        device .setApproved(approved);
        deviceBindingRepository.save(device);

        // 승인 해제 된 경우 -> 소켓으로 알림 전송
        if (!approved) {
            System.out.println("1111");
            HeartRateWebSocketHandler.sendMessageToDevice(deviceId, "REVOKED");
        }

        return device;

    }

}
