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
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    public List<TaskResponse> getAll() {
        return taskRepository.findAll().stream().map(TaskResponse::from).toList();
    }

    public Map<String, List<TaskResponse>> getTasksByColumn() {
        return taskRepository.findAll().stream()
                .map(TaskResponse::from)
                .collect(Collectors.groupingBy(TaskResponse::getColumnId));
    }

    public TaskResponse getById(String id) {
        return TaskResponse.from(findOrThrow(id));
    }

    public TaskResponse create(TaskRequest req) {
        Task task = mapToEntity(new Task(), req);
        // Set creation date in frontend format
        LocalDateTime now = LocalDateTime.now();
        task.setDate(now.format(DateTimeFormatter.ofPattern("MM/dd  h:mm a")));
        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse update(String id, TaskRequest req) {
        Task task = mapToEntity(findOrThrow(id), req);
        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse moveTask(String id, String columnId) {
        Task task = findOrThrow(id);
        task.setColumnId(columnId);
        if ("done".equals(columnId)) {
            task.setCompleted(true);
        } else {
            task.setCompleted(false);
        }
        return TaskResponse.from(taskRepository.save(task));
    }

    public void delete(String id) {
        taskRepository.delete(findOrThrow(id));
    }

    public TaskResponse toggleComplete(String id) {
        Task task = findOrThrow(id);
        task.setCompleted(!task.isCompleted());
        task.setColumnId(task.isCompleted() ? "done" : "todo");
        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse updateTimer(String id, long seconds) {
        Task task = findOrThrow(id);
        task.setActualSeconds(seconds);
        return TaskResponse.from(taskRepository.save(task));
    }

    public List<TaskResponse> search(String query) {
        return taskRepository
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query)
                .stream().map(TaskResponse::from).toList();
    }

    public List<TaskResponse> filter(String category, Task.Priority priority, String columnId,
                                     Boolean completed, LocalDateTime from, LocalDateTime to) {
        return taskRepository.findAll().stream()
                .filter(t -> category == null || category.equalsIgnoreCase(t.getCategory()))
                .filter(t -> priority == null || priority == t.getPriority())
                .filter(t -> columnId == null || columnId.equals(t.getColumnId()))
                .filter(t -> completed == null || completed == t.isCompleted())
                .filter(t -> from == null || !t.getCreatedAt().isBefore(from))
                .filter(t -> to == null || !t.getCreatedAt().isAfter(to))
                .map(TaskResponse::from).toList();
    }

    public List<TaskResponse> getOverdue() {
        // Since frontend uses string dates, we'll check based on creation time for now
        return taskRepository.findByCompletedFalse()
                .stream().map(TaskResponse::from).toList();
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private Task findOrThrow(String id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }

    private Task mapToEntity(Task task, TaskRequest req) {
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setPriority(req.getPriority() != null ? req.getPriority() : Task.Priority.Medium);
        task.setCategory(req.getCategory());
        task.setColumnId(req.getColumnId() != null ? req.getColumnId() : "todo");
        task.setDueDate(req.getDueDate());
        task.setEstimatedHours(req.getEstimatedHours());
        task.setAssigneeName(req.getAssigneeName());
        task.setAssigneeAvatar(req.getAssigneeAvatar());
        task.setChannelName(req.getChannelName() != null ? req.getChannelName() : "GitHub");
        task.setChannelIcon(req.getChannelIcon() != null ? req.getChannelIcon() : "github");
        task.setMemberAvatars(req.getMemberAvatars());
        task.setExtraMembers(req.getExtraMembers());
        task.setImage(req.getImage());
        
        if (req.getRecurring() != null) task.setRecurring(req.getRecurring());
        if (req.getDependencies() != null) task.setDependencies(req.getDependencies());

        task.getSubtasks().clear();
        if (req.getSubtasks() != null) {
            req.getSubtasks().forEach(sr -> {
                Subtask s = new Subtask();
                s.setTitle(sr.getTitle());
                s.setCompleted(sr.isCompleted());
                s.setHours(sr.getHours());
                task.getSubtasks().add(s);
            });
        }
        return task;
    }
}
