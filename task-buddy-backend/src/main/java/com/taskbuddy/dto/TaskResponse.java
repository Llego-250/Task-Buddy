package com.taskbuddy.dto;

import com.taskbuddy.model.RecurringConfig;
import com.taskbuddy.model.Subtask;
import com.taskbuddy.model.Task;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private Task.Priority priority;
    private String category;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private boolean completed;
    private double estimatedHours;
    private long actualSeconds;
    private int progress;           // % of completed subtasks
    private RecurringConfig recurring;
    private List<Long> dependencies;
    private List<SubtaskResponse> subtasks;

    public static TaskResponse from(Task task) {
        TaskResponse r = new TaskResponse();
        r.setId(task.getId());
        r.setTitle(task.getTitle());
        r.setDescription(task.getDescription());
        r.setPriority(task.getPriority());
        r.setCategory(task.getCategory());
        r.setDueDate(task.getDueDate());
        r.setCreatedAt(task.getCreatedAt());
        r.setCompleted(task.isCompleted());
        r.setEstimatedHours(task.getEstimatedHours());
        r.setActualSeconds(task.getActualSeconds());
        r.setRecurring(task.getRecurring());
        r.setDependencies(task.getDependencies());

        List<SubtaskResponse> subtasks = task.getSubtasks().stream()
                .map(SubtaskResponse::from).toList();
        r.setSubtasks(subtasks);

        int total = subtasks.size();
        int done = (int) subtasks.stream().filter(SubtaskResponse::isCompleted).count();
        r.setProgress(total == 0 ? (task.isCompleted() ? 100 : 0) : (done * 100 / total));

        return r;
    }
}
