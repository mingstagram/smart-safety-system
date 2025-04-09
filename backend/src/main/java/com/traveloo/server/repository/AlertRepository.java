package com.traveloo.server.repository;

import com.traveloo.server.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByUserId(Long userId);
    List<Alert> findByUserIdAndResolved(Long userId, Boolean resolved);
    List<Alert> findByResolved(Boolean resolved);
} 