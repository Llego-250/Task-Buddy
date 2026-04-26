package com.taskbuddy.dto;

import com.taskbuddy.model.RecurringConfig;
import com.taskbuddy.model.Task;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private Task.Priority priority = Task.Priority.Medium;

    private String category;

    private String columnId = "todo";

    private String dueDate;

    private double estimatedHours;

    private String assigneeName;

    private String assigneeAvatar;

    private String channelName;

    private String channelIcon;

    private List<String> memberAvatars;

    private int extraMembers;

    private String image;

    private RecurringConfig recurring;

    private List<String> dependencies;

    private List<SubtaskRequest> subtasks;
}
