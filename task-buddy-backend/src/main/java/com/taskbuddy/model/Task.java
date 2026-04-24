package com.taskbuddy.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
 

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "tasks")
@Data
@NoArgsConstructor
public class Task {

    @Id
    private String id = UUID.randomUUID().toString();

    private String title;

    private String description;

    private Priority priority = Priority.MEDIUM;

    private String category;

    private LocalDateTime dueDate;

    private LocalDateTime createdAt = LocalDateTime.now();

    private boolean completed = false;

    private double estimatedHours;

    private long actualSeconds = 0;

    private RecurringConfig recurring = new RecurringConfig();

    // store dependency ids as strings
    private List<String> dependencies = new ArrayList<>();

    // store subtasks as embedded documents
    private List<Subtask> subtasks = new ArrayList<>();

    public enum Priority { HIGH, MEDIUM, LOW }
}
