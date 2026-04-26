package com.taskbuddy.dto;

import jakarta.validation.constraints.NotBlank;

public class SubtaskRequest {

    @NotBlank(message = "Subtask title is required")
    private String title;
    private boolean completed = false;
    private double hours;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public double getHours() { return hours; }
    public void setHours(double hours) { this.hours = hours; }
}
