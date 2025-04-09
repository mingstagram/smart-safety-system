package com.traveloo.server.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceApprovalRequest {
    private String deviceId;
    private boolean approved;
}