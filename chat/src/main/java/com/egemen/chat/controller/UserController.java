package com.egemen.chat.controller;

import com.egemen.chat.service.InMemoryAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {
    private final InMemoryAuthService authService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public UserController(InMemoryAuthService authService, SimpMessagingTemplate messagingTemplate) {
        this.authService = authService;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/login")
    public String login(@RequestParam String userId) {
        authService.saveUserSession(userId, "User logged in");
        messagingTemplate.convertAndSend("/topic/refresh", "Kullanici giris yapti" + userId);
        return "Kullanıcı giriş yaptı: " + userId;
    }

    @GetMapping("/auth")
    public String getUser(@RequestParam("userId") String userId) {
        String session = authService.getUserSession(userId);
        if (session != null) {
            messagingTemplate.convertAndSend("/topic/refresh", "Kullanici dogrulandi" + userId);
            return session;
        } else {
            return "Kullanıcı bulunamadı.";
        }
    }
}

