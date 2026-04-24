package com.taskbuddy.controller;

import com.taskbuddy.dto.TaskRequest;
import com.taskbuddy.dto.TaskResponse;
import com.taskbuddy.model.Task;
import com.taskbuddy.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<TaskResponse> getAll() {
        return taskService.getAll();
    }

    @GetMapping("/{id}")
    public TaskResponse getById(@PathVariable Long id) {
        return taskService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@Valid @RequestBody TaskRequest req) {
        return taskService.create(req);
    }

    @PutMapping("/{id}")
    public TaskResponse update(@PathVariable Long id, @Valid @RequestBody TaskRequest req) {
        return taskService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        taskService.delete(id);
    }

    @PatchMapping("/{id}/toggle")
    public TaskResponse toggleComplete(@PathVariable Long id) {
        return taskService.toggleComplete(id);
    }

    @PatchMapping("/{id}/timer")
    public TaskResponse updateTimer(@PathVariable Long id, @RequestParam long seconds) {
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
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return taskService.filter(category, priority, completed, from, to);
    }

    @GetMapping("/overdue")
    public List<TaskResponse> getOverdue() {
        return taskService.getOverdue();
    }
}
