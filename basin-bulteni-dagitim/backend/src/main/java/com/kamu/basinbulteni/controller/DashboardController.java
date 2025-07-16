package com.kamu.basinbulteni.controller;

import com.kamu.basinbulteni.dto.DashboardSummaryResponse;
import com.kamu.basinbulteni.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(Authentication authentication) {
        DashboardSummaryResponse response = dashboardService.getSummary(authentication.getName());
        return ResponseEntity.ok(response);
    }
} 