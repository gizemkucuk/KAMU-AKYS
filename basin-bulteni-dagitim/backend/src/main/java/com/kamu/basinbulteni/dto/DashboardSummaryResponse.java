package com.kamu.basinbulteni.dto;

import com.kamu.basinbulteni.model.PressReleaseStatus;
import com.kamu.basinbulteni.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalPressReleases;
    private long publishedPressReleases;
    private long draftPressReleases;
    private long rejectedPressReleases;
    private long archivedPressReleases;
    private long pendingPressReleases;
    private long totalUsers;
    private long activeUsers;
    private List<UserSummary> recentUsers;
    private List<PressReleaseSummary> recentPressReleases;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String name;
        private String email;
        private Role role;
        private String lastLogin;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PressReleaseSummary {
        private Long id;
        private String title;
        private PressReleaseStatus status;
        private String author;
        private String createdAt;
    }
} 