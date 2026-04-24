package com.taskbuddy.controller;

import com.taskbuddy.dto.NotificationRequest;
import com.taskbuddy.model.Notification;
import com.taskbuddy.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Notification create(@Valid @RequestBody NotificationRequest req) {
        return notificationService.create(req);
    }

    @GetMapping("/unread")
    public List<Notification> getUnread() {
        return notificationService.getUnread();
    }

    @GetMapping("/due")
    public List<Notification> getDue() {
        return notificationService.getDue();
    }

    @PatchMapping("/{id}/read")
    public Notification markRead(@PathVariable String id) {
        return notificationService.markRead(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        notificationService.delete(id);
    }
}
