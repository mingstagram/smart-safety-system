package com.traveloo.server.controller;

import com.traveloo.server.entity.HealthData;
import com.traveloo.server.service.HealthDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/health-data")
public class HealthDataController {
    @Autowired
    private HealthDataService healthDataService;

    @PostMapping
    public ResponseEntity<HealthData> createHealthData(@RequestBody HealthData healthData) {
        return ResponseEntity.ok(healthDataService.saveHealthData(healthData));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HealthData>> getHealthDataByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(healthDataService.getHealthDataByUserId(userId));
    }

    @GetMapping("/user/{userId}/date-range")
    public ResponseEntity<List<HealthData>> getHealthDataByDateRange(
            @PathVariable Long userId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(healthDataService.getHealthDataByUserIdAndDateRange(userId, start, end));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHealthData(@PathVariable Long id) {
        healthDataService.deleteHealthData(id);
        return ResponseEntity.ok().build();
    }
} 