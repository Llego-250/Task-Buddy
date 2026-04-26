package com.taskbuddy.dto;

import com.taskbuddy.model.RecurringConfig;
import com.taskbuddy.model.Task;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

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
    public double getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(double estimatedHours) { this.estimatedHours = estimatedHours; }
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
    public List<SubtaskRequest> getSubtasks() { return subtasks; }
    public void setSubtasks(List<SubtaskRequest> subtasks) { this.subtasks = subtasks; }
}
