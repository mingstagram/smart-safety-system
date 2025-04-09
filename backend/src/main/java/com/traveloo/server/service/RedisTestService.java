package com.traveloo.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedisTestService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void testRedis() {
        String key = "test:message";
        String value = "Hello Redis!";

        redisTemplate.opsForValue().set(key, value);
        String result = (String) redisTemplate.opsForValue().get(key);

        System.out.println("redis 테스트 결과 : " + result);

    }

}
