package com.egemen.chat.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class InMemoryAuthService {
    private final ConcurrentHashMap<String, String> userSessions = new ConcurrentHashMap<>();

    public void saveUserSession(String userId, String sessionData) {
        userSessions.put(userId, sessionData);
    }

    public String getUserSession(String userId) {
        return userSessions.get(userId);
    }

    public void removeUserSession(String userId) {
        userSessions.remove(userId);
    }
}

