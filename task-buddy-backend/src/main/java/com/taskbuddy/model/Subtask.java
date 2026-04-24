package com.taskbuddy.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class Subtask {
    private String id = UUID.randomUUID().toString();
    private String title;
    private boolean completed = false;
    private double hours;
}
