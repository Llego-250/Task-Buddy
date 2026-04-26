package com.taskbuddy.controller;

import com.taskbuddy.dto.TaskRequest;
import com.taskbuddy.dto.TaskResponse;
import com.taskbuddy.model.Task;
import com.taskbuddy.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<TaskResponse> getAll() {
        return taskService.getAll();
    }

    @GetMapping("/kanban")
    public Map<String, List<TaskResponse>> getKanbanTasks() {
        return taskService.getTasksByColumn();
    }

    @GetMapping("/{id}")
    public TaskResponse getById(@PathVariable String id) {
        return taskService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@Valid @RequestBody TaskRequest req) {
        return taskService.create(req);
    }

    @PutMapping("/{id}")
    public TaskResponse update(@PathVariable String id, @Valid @RequestBody TaskRequest req) {
        return taskService.update(id, req);
    }

    @PatchMapping("/{id}/move")
    public TaskResponse moveTask(@PathVariable String id, @RequestParam String columnId) {
        return taskService.moveTask(id, columnId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        taskService.delete(id);
    }

    @PatchMapping("/{id}/toggle")
    public TaskResponse toggleComplete(@PathVariable String id) {
        return taskService.toggleComplete(id);
    }

    @PatchMapping("/{id}/timer")
    public TaskResponse updateTimer(@PathVariable String id, @RequestParam long seconds) {
        return taskService.updateTimer(id, seconds);
    }

    @GetMapping("/search")
    public List<TaskResponse> search(@RequestParam String q) {
        return taskService.search(q);
    }

    @GetMapping("/filter")
    public List<TaskResponse> filter(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Task.Priority priority,
            @RequestParam(required = false) String columnId,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return taskService.filter(category, priority, columnId, completed, from, to);
    }

    @GetMapping("/overdue")
    public List<TaskResponse> getOverdue() {
        return taskService.getOverdue();
    }
}
