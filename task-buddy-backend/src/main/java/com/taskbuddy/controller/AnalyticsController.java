package com.taskbuddy.controller;

import com.taskbuddy.dto.AnalyticsResponse;
import com.taskbuddy.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public AnalyticsResponse getSummary() {
        return analyticsService.getSummary();
    }
}
