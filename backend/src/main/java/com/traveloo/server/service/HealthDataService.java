package com.traveloo.server.service;

import com.traveloo.server.entity.HealthData;
import com.traveloo.server.repository.HealthDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class HealthDataService {
    @Autowired
    private HealthDataRepository healthDataRepository;

    public HealthData saveHealthData(HealthData healthData) {
        return healthDataRepository.save(healthData);
    }

    public List<HealthData> getHealthDataByUserId(Long userId) {
        return healthDataRepository.findByUserId(userId);
    }

    public List<HealthData> getHealthDataByUserIdAndDateRange(Long userId, LocalDateTime start, LocalDateTime end) {
        return healthDataRepository.findByUserIdAndMeasuredAtBetween(userId, start, end);
    }

    public void deleteHealthData(Long id) {
        healthDataRepository.deleteById(id);
    }
} 