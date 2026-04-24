package com.taskbuddy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubtaskRequest {

    @NotBlank(message = "Subtask title is required")
    private String title;

    private boolean completed = false;

    private double hours;
}
