package com.taskbuddy.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationRequest {

    @NotNull
    private Long taskId;

    private String message;

    @NotNull
    private LocalDateTime remindAt;
}
