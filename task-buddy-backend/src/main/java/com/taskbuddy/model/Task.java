package com.taskbuddy.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tasks")
public class Task {

    @Id
    private String id;
    private String title;
    private String description;
    private Priority priority = Priority.Medium;
    private String category;
    private String columnId = "todo";
    private String dueDate;
    private String date;
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

    public Task() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
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
    public List<Subtask> getSubtasks() { return subtasks; }
    public void setSubtasks(List<Subtask> subtasks) { this.subtasks = subtasks; }
}
