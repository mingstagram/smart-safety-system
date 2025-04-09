package com.traveloo.server.repository;

import com.traveloo.server.entity.HealthData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface HealthDataRepository extends JpaRepository<HealthData, Long> {
    List<HealthData> findByUserId(Long userId);
    List<HealthData> findByUserIdAndMeasuredAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
} 