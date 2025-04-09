package com.traveloo.server.repository;

import com.traveloo.server.entity.DeviceBinding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeviceBindingRepository extends JpaRepository<DeviceBinding, Long> {
    Optional<DeviceBinding> findByDeviceId(String deviceId);
}