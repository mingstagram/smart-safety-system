package com.traveloo.server.controller;

import com.traveloo.server.service.RedisTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RedisTestController {

    private final RedisTestService redisTestService;

    @GetMapping("/redis/test")
    public String testRedis() {
        redisTestService.testRedis();
        return "Redis 테스트 완료";
    }

}
