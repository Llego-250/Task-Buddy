package com.taskbuddy.model;

import java.util.UUID;

public class Subtask {
    private String id = UUID.randomUUID().toString();
    private String title;
    private boolean completed = false;
    private double hours;

    public Subtask() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public double getHours() { return hours; }
    public void setHours(double hours) { this.hours = hours; }
}
