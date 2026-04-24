package com.taskbuddy.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
public class Notification {

    @Id
    private String id = UUID.randomUUID().toString();

    // reference to task id (string)
    private String taskId;

    private String message;

    private LocalDateTime remindAt;

    private boolean read = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
