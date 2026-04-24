package com.taskbuddy.repository;

import com.taskbuddy.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByReadFalse();
    List<Notification> findByTaskId(String taskId);
    List<Notification> findByRemindAtBeforeAndReadFalse(LocalDateTime now);
}
