package com.taskbuddy.dto;

import com.taskbuddy.model.RecurringConfig;
import com.taskbuddy.model.Task;

import java.time.LocalDateTime;
import java.util.List;

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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Task.Priority getPriority() { return priority; }
    public void setPriority(Task.Priority priority) { this.priority = priority; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getColumnId() { return columnId; }
    public void setColumnId(String columnId) { this.columnId = columnId; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public double getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(double estimatedHours) { this.estimatedHours = estimatedHours; }
    public long getActualSeconds() { return actualSeconds; }
    public void setActualSeconds(long actualSeconds) { this.actualSeconds = actualSeconds; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
    public String getAssigneeName() { return assigneeName; }
    public void setAssigneeName(String assigneeName) { this.assigneeName = assigneeName; }
    public String getAssigneeAvatar() { return assigneeAvatar; }
    public void setAssigneeAvatar(String assigneeAvatar) { this.assigneeAvatar = assigneeAvatar; }
    public String getChannelName() { return channelName; }
    public void setChannelName(String channelName) { this.channelName = channelName; }
    public String getChannelIcon() { return channelIcon; }
    public void setChannelIcon(String channelIcon) { this.channelIcon = channelIcon; }
    public List<String> getMemberAvatars() { return memberAvatars; }
    public void setMemberAvatars(List<String> memberAvatars) { this.memberAvatars = memberAvatars; }
    public int getExtraMembers() { return extraMembers; }
    public void setExtraMembers(int extraMembers) { this.extraMembers = extraMembers; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public RecurringConfig getRecurring() { return recurring; }
    public void setRecurring(RecurringConfig recurring) { this.recurring = recurring; }
    public List<String> getDependencies() { return dependencies; }
    public void setDependencies(List<String> dependencies) { this.dependencies = dependencies; }
    public List<SubtaskResponse> getSubtasks() { return subtasks; }
    public void setSubtasks(List<SubtaskResponse> subtasks) { this.subtasks = subtasks; }
}
