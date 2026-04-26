package com.taskbuddy.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id = UUID.randomUUID().toString();
    private String taskId;
    private String message;
    private LocalDateTime remindAt;
    private boolean read = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getRemindAt() { return remindAt; }
    public void setRemindAt(LocalDateTime remindAt) { this.remindAt = remindAt; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
