package com.traveloo.server.controller;

import com.traveloo.server.dto.DeviceApprovalRequest;
import com.traveloo.server.entity.DeviceBinding;
import com.traveloo.server.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/device")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping("/register")
    public ResponseEntity<?> registerDevice(@RequestBody Map<String, String> body) {
        String deviceId = body.get("deviceId");

        DeviceBinding binding = deviceService.registerOrFindDevice(deviceId);
        String status = binding.isApproved() ? "APPROVED" : "PENDING";

        return ResponseEntity.ok(Map.of("status", status));
    }

    @GetMapping("/status/{deviceId}")
    public ResponseEntity<?> checkStatus(@PathVariable String deviceId) {
        return deviceService.getDeviceByDeviceId(deviceId)
                .map(binding -> {
                    String status = binding.isApproved() ? "APPROVED" : "PENDING";
                    return ResponseEntity.ok(Map.of("status", status));
                })
                .orElse(ResponseEntity.status(404).body(Map.of("status", "NOT_REGISTERED")));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllDevices() {
        return ResponseEntity.ok(deviceService.findAllDevices());
    }

    @PutMapping("/approve")
    public ResponseEntity<?> updateApproval(@RequestBody DeviceApprovalRequest request) {
        DeviceBinding updated = deviceService.updateDeviceApproval(request.getDeviceId(), request.isApproved());
        return ResponseEntity.ok(Map.of(
                "status", "updated",
                "deviceId", updated.getDeviceId(),
                "approved", updated.isApproved()
        ));
    }

}
