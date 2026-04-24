package com.taskbuddy.service;

import com.taskbuddy.dto.TaskRequest;
import com.taskbuddy.dto.TaskResponse;
import com.taskbuddy.exception.ResourceNotFoundException;
import com.taskbuddy.model.Subtask;
import com.taskbuddy.model.Task;
import com.taskbuddy.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    public List<TaskResponse> getAll() {
        return taskRepository.findAll().stream().map(TaskResponse::from).toList();
    }

    public TaskResponse getById(Long id) {
        return TaskResponse.from(findOrThrow(id));
    }

    public TaskResponse create(TaskRequest req) {
        Task task = mapToEntity(new Task(), req);
        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse update(Long id, TaskRequest req) {
        Task task = mapToEntity(findOrThrow(id), req);
        return TaskResponse.from(taskRepository.save(task));
    }

    public void delete(Long id) {
        taskRepository.delete(findOrThrow(id));
    }

    public TaskResponse toggleComplete(Long id) {
        Task task = findOrThrow(id);
        task.setCompleted(!task.isCompleted());
        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse updateTimer(Long id, long seconds) {
        Task task = findOrThrow(id);
        task.setActualSeconds(seconds);
        return TaskResponse.from(taskRepository.save(task));
    }

    public List<TaskResponse> search(String query) {
        return taskRepository
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query)
                .stream().map(TaskResponse::from).toList();
    }

    public List<TaskResponse> filter(String category, Task.Priority priority, Boolean completed,
                                     LocalDateTime from, LocalDateTime to) {
        return taskRepository.findAll().stream()
                .filter(t -> category == null || category.equalsIgnoreCase(t.getCategory()))
                .filter(t -> priority == null || priority == t.getPriority())
                .filter(t -> completed == null || completed == t.isCompleted())
                .filter(t -> from == null || (t.getDueDate() != null && !t.getDueDate().isBefore(from)))
                .filter(t -> to == null || (t.getDueDate() != null && !t.getDueDate().isAfter(to)))
                .map(TaskResponse::from).toList();
    }

    public List<TaskResponse> getOverdue() {
        return taskRepository.findByDueDateBeforeAndCompletedFalse(LocalDateTime.now())
                .stream().map(TaskResponse::from).toList();
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private Task findOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }

    private Task mapToEntity(Task task, TaskRequest req) {
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setPriority(req.getPriority() != null ? req.getPriority() : Task.Priority.MEDIUM);
        task.setCategory(req.getCategory());
        task.setDueDate(req.getDueDate());
        task.setEstimatedHours(req.getEstimatedHours());
        if (req.getRecurring() != null) task.setRecurring(req.getRecurring());
        if (req.getDependencies() != null) task.setDependencies(req.getDependencies());

        task.getSubtasks().clear();
        if (req.getSubtasks() != null) {
            req.getSubtasks().forEach(sr -> {
                Subtask s = new Subtask();
                s.setTitle(sr.getTitle());
                s.setCompleted(sr.isCompleted());
                s.setHours(sr.getHours());
                s.setTask(task);
                task.getSubtasks().add(s);
            });
        }
        return task;
    }
}
