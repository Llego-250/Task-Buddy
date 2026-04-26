package com.taskbuddy.service;

import com.taskbuddy.dto.AnalyticsResponse;
import com.taskbuddy.model.Task;
import com.taskbuddy.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    private final TaskRepository taskRepository;

    public AnalyticsService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public AnalyticsResponse getSummary() {
        List<Task> all = taskRepository.findAll();
        long total = all.size();
        long completed = all.stream().filter(Task::isCompleted).count();
        long overdue = taskRepository.findByDueDateBeforeAndCompletedFalse(LocalDateTime.now()).size();

        double totalEstimated = all.stream().mapToDouble(Task::getEstimatedHours).sum();
        double totalActual = all.stream().mapToDouble(t -> t.getActualSeconds() / 3600.0).sum();

        Map<String, Long> byPriority = all.stream()
                .collect(Collectors.groupingBy(t -> t.getPriority().name(), Collectors.counting()));

        Map<String, Long> byCategory = all.stream()
                .filter(t -> t.getCategory() != null)
                .collect(Collectors.groupingBy(Task::getCategory, Collectors.counting()));

        Map<String, Long> byDate = all.stream()
                .filter(t -> t.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE),
                        Collectors.counting()));

        return AnalyticsResponse.builder()
                .totalTasks(total)
                .completedTasks(completed)
                .overdueTasks(overdue)
                .activeTasks(total - completed - overdue)
                .completionRate(total == 0 ? 0 : (completed * 100.0 / total))
                .totalEstimatedHours(totalEstimated)
                .totalActualHours(totalActual)
                .byPriority(byPriority)
                .byCategory(byCategory)
                .byDate(byDate)
                .build();
    }
}
