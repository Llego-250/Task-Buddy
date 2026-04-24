package com.taskbuddy.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class RecurringConfig {
    private boolean enabled = false;
    private String type = "daily";   // daily | weekly | monthly
    private int interval = 1;
}
