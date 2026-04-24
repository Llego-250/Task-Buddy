package com.taskbuddy.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class AnalyticsResponse {
    private long totalTasks;
    private long completedTasks;
    private long overdueTasks;
    private long activeTasks;
    private double completionRate;          // percentage
    private double totalEstimatedHours;
    private double totalActualHours;
    private Map<String, Long> byPriority;
    private Map<String, Long> byCategory;
}
