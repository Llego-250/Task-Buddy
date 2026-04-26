package com.taskbuddy.model;

import lombok.Data;

@Data
public class RecurringConfig {
    private boolean enabled = false;
    private String type = "daily";   // daily | weekly | monthly
    private int interval = 1;
}
