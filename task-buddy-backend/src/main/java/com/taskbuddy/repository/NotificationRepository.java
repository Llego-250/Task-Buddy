package com.taskbuddy.repository;

import com.taskbuddy.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReadFalse();
    List<Notification> findByTaskId(Long taskId);
    List<Notification> findByRemindAtBeforeAndReadFalse(LocalDateTime now);
}
