package com.taskbuddy.dto;

import java.util.Map;

public class AnalyticsResponse {
    private long totalTasks;
    private long completedTasks;
    private long overdueTasks;
    private long activeTasks;
    private double completionRate;
    private double totalEstimatedHours;
    private double totalActualHours;
    private Map<String, Long> byPriority;
    private Map<String, Long> byCategory;
    private Map<String, Long> byDate;

    private AnalyticsResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final AnalyticsResponse r = new AnalyticsResponse();
        public Builder totalTasks(long v) { r.totalTasks = v; return this; }
        public Builder completedTasks(long v) { r.completedTasks = v; return this; }
        public Builder overdueTasks(long v) { r.overdueTasks = v; return this; }
        public Builder activeTasks(long v) { r.activeTasks = v; return this; }
        public Builder completionRate(double v) { r.completionRate = v; return this; }
        public Builder totalEstimatedHours(double v) { r.totalEstimatedHours = v; return this; }
        public Builder totalActualHours(double v) { r.totalActualHours = v; return this; }
        public Builder byPriority(Map<String, Long> v) { r.byPriority = v; return this; }
        public Builder byCategory(Map<String, Long> v) { r.byCategory = v; return this; }
        public Builder byDate(Map<String, Long> v) { r.byDate = v; return this; }
        public AnalyticsResponse build() { return r; }
    }

    public long getTotalTasks() { return totalTasks; }
    public long getCompletedTasks() { return completedTasks; }
    public long getOverdueTasks() { return overdueTasks; }
    public long getActiveTasks() { return activeTasks; }
    public double getCompletionRate() { return completionRate; }
    public double getTotalEstimatedHours() { return totalEstimatedHours; }
    public double getTotalActualHours() { return totalActualHours; }
    public Map<String, Long> getByPriority() { return byPriority; }
    public Map<String, Long> getByCategory() { return byCategory; }
    public Map<String, Long> getByDate() { return byDate; }
}
