package com.taskbuddy.service;

import com.taskbuddy.dto.NotificationRequest;
import com.taskbuddy.exception.ResourceNotFoundException;
import com.taskbuddy.model.Notification;
import com.taskbuddy.model.Task;
import com.taskbuddy.repository.NotificationRepository;
import com.taskbuddy.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final TaskRepository taskRepository;

    public Notification create(NotificationRequest req) {
        Task task = taskRepository.findById(req.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + req.getTaskId()));
        Notification n = new Notification();
        n.setTask(task);
        n.setMessage(req.getMessage() != null ? req.getMessage()
                : "Reminder: " + task.getTitle() + " is due soon.");
        n.setRemindAt(req.getRemindAt());
        return notificationRepository.save(n);
    }

    public List<Notification> getUnread() {
        return notificationRepository.findByReadFalse();
    }

    public List<Notification> getDue() {
        return notificationRepository.findByRemindAtBeforeAndReadFalse(LocalDateTime.now());
    }

    public Notification markRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        n.setRead(true);
        return notificationRepository.save(n);
    }

    public void delete(Long id) {
        notificationRepository.deleteById(id);
    }
}
