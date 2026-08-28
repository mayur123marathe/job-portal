package com.mayur.job.controller;

import com.mayur.job.service.EmailNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final EmailNotificationService emailNotificationService;

//    @GetMapping("/sent")
//    public String sendStatusChangedEmail() throws Exception {
//        emailNotificationService.sendStatusChangedEmail();
//        return "Email sent successfully";
//    }
}
