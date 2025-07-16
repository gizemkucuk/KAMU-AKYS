package com.kamu.basinbulteni.dto;

import com.kamu.basinbulteni.model.PressReleaseStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PressReleaseResponse {
    private Long id;
    private String title;
    private String content;
    private PressReleaseStatus status;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 