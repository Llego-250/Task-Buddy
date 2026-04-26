package com.taskbuddy.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tasks")
@Data
@NoArgsConstructor
public class Task {

    @Id
    private String id;

    private String title;

    private String description;

    private Priority priority = Priority.Medium;

    private String category;

    private String columnId = "todo";

    private String dueDate; // Frontend uses string format

    private String date; // Frontend creation date format

    private LocalDateTime createdAt = LocalDateTime.now();

    private boolean completed = false;

    private double estimatedHours;

    private long actualSeconds = 0;

    private String assigneeName;

    private String assigneeAvatar;

    private String channelName;

    private String channelIcon;

    private List<String> memberAvatars = new ArrayList<>();

    private int extraMembers = 0;

    private String image;

    private RecurringConfig recurring = new RecurringConfig();

    private List<String> dependencies = new ArrayList<>();

    private List<Subtask> subtasks = new ArrayList<>();

    public enum Priority { High, Medium, Low }

    public enum Column { todo, inprogress, inreview, done }
}
