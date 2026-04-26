package com.taskbuddy.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class NotificationRequest {

    @NotNull
    private String taskId;
    private String message;
    @NotNull
    private LocalDateTime remindAt;

    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getRemindAt() { return remindAt; }
    public void setRemindAt(LocalDateTime remindAt) { this.remindAt = remindAt; }
}
