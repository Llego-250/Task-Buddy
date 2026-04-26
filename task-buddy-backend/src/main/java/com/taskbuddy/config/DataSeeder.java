package com.taskbuddy.config;

import com.taskbuddy.repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TaskRepository taskRepository;

    public DataSeeder(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) {
        // No seed data - tasks are created by users
    }
}