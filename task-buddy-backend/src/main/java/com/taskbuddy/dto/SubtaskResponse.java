package com.taskbuddy.dto;

import com.taskbuddy.model.Subtask;
import lombok.Data;

@Data
public class SubtaskResponse {
    private Long id;
    private String title;
    private boolean completed;
    private double hours;

    public static SubtaskResponse from(Subtask s) {
        SubtaskResponse r = new SubtaskResponse();
        r.setId(s.getId());
        r.setTitle(s.getTitle());
        r.setCompleted(s.isCompleted());
        r.setHours(s.getHours());
        return r;
    }
}
