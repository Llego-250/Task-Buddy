package com.taskbuddy.dto;

import com.taskbuddy.model.RecurringConfig;
import com.taskbuddy.model.Task;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private Task.Priority priority = Task.Priority.MEDIUM;

    private String category;

    private LocalDateTime dueDate;

    private double estimatedHours;

    private RecurringConfig recurring;

    private List<Long> dependencies;

    private List<SubtaskRequest> subtasks;
}
