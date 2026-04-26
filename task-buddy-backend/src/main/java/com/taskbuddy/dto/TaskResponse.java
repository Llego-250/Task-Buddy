package com.taskbuddy.dto;

import com.taskbuddy.model.RecurringConfig;
import com.taskbuddy.model.Task;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskResponse {

    private String id;
    private String title;
    private String description;
    private Task.Priority priority;
    private String category;
    private String columnId;
    private String dueDate;
    private String date;
    private LocalDateTime createdAt;
    private boolean completed;
    private double estimatedHours;
    private long actualSeconds;
    private int progress;
    private String assigneeName;
    private String assigneeAvatar;
    private String channelName;
    private String channelIcon;
    private List<String> memberAvatars;
    private int extraMembers;
    private String image;
    private RecurringConfig recurring;
    private List<String> dependencies;
    private List<SubtaskResponse> subtasks;

    public static TaskResponse from(Task task) {
        TaskResponse r = new TaskResponse();
        r.setId(task.getId());
        r.setTitle(task.getTitle());
        r.setDescription(task.getDescription());
        r.setPriority(task.getPriority());
        r.setCategory(task.getCategory());
        r.setColumnId(task.getColumnId());
        r.setDueDate(task.getDueDate());
        r.setDate(task.getDate());
        r.setCreatedAt(task.getCreatedAt());
        r.setCompleted(task.isCompleted());
        r.setEstimatedHours(task.getEstimatedHours());
        r.setActualSeconds(task.getActualSeconds());
        r.setAssigneeName(task.getAssigneeName());
        r.setAssigneeAvatar(task.getAssigneeAvatar());
        r.setChannelName(task.getChannelName());
        r.setChannelIcon(task.getChannelIcon());
        r.setMemberAvatars(task.getMemberAvatars());
        r.setExtraMembers(task.getExtraMembers());
        r.setImage(task.getImage());
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
