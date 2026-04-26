package com.taskbuddy.dto;

import com.taskbuddy.model.Subtask;

public class SubtaskResponse {
    private String id;
    private String title;
    private boolean completed;
    private double hours;

    public static SubtaskResponse from(Subtask s) {
        SubtaskResponse r = new SubtaskResponse();
        r.setId(s.getId());
        r.setTitle(s.getTitle());
        r.setCompleted(s.isCompleted());
        r.setHours(s.getHours());
        return r;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public double getHours() { return hours; }
    public void setHours(double hours) { this.hours = hours; }
}
