package com.taskbuddy.config;

import com.taskbuddy.model.Task;
import com.taskbuddy.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TaskRepository taskRepository;

    @Override
    public void run(String... args) {
        if (taskRepository.count() == 0) {
            seedTasks();
        }
    }

    private void seedTasks() {
        List<Task> tasks = Arrays.asList(
            createTask("Design System Work", "todo", Task.Priority.High, "Design", 
                      "Create comprehensive design system for the application", 
                      "Darlene Robertson", "https://i.pravatar.cc/32?img=1"),
            
            createTask("API Integration", "inprogress", Task.Priority.Medium, "Development",
                      "Integrate frontend with backend API endpoints",
                      "John Doe", "https://i.pravatar.cc/32?img=2"),
            
            createTask("User Testing", "inreview", Task.Priority.Low, "Research",
                      "Conduct user testing sessions for new features",
                      "Jane Smith", "https://i.pravatar.cc/32?img=3"),
            
            createTask("Documentation", "done", Task.Priority.Medium, "Other",
                      "Complete project documentation and README",
                      "Bob Wilson", "https://i.pravatar.cc/32?img=4")
        );

        taskRepository.saveAll(tasks);
    }

    private Task createTask(String title, String columnId, Task.Priority priority, 
                           String category, String description, String assigneeName, String avatar) {
        Task task = new Task();
        task.setTitle(title);
        task.setColumnId(columnId);
        task.setPriority(priority);
        task.setCategory(category);
        task.setDescription(description);
        task.setAssigneeName(assigneeName);
        task.setAssigneeAvatar(avatar);
        task.setChannelName("GitHub");
        task.setChannelIcon("github");
        task.setDate("12/15  10:30 AM");
        return task;
    }
}