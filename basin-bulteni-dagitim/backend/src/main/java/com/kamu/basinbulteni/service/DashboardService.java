package com.kamu.basinbulteni.service;

import com.kamu.basinbulteni.dto.DashboardSummaryResponse;
import com.kamu.basinbulteni.model.PressRelease;
import com.kamu.basinbulteni.model.PressReleaseStatus;
import com.kamu.basinbulteni.model.Role;
import com.kamu.basinbulteni.model.User;
import com.kamu.basinbulteni.repository.PressReleaseRepository;
import com.kamu.basinbulteni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final PressReleaseRepository pressReleaseRepository;
    private final UserRepository userRepository;

    public DashboardSummaryResponse getSummary(String userEmail) {
        User user = userRepository.findByUsernameOrEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        boolean isAdmin = user.getRole() == Role.ADMIN;

        // Bülten sayıları
        long totalPressReleases = isAdmin ? pressReleaseRepository.count() : pressReleaseRepository.countByCreatedBy(user);
        long publishedPressReleases = isAdmin ? pressReleaseRepository.countByStatus(PressReleaseStatus.PUBLISHED) : pressReleaseRepository.countByStatusAndCreatedByOrPublished(PressReleaseStatus.PUBLISHED, user);
        long draftPressReleases = isAdmin ? pressReleaseRepository.countByStatusAndCreatedBy(PressReleaseStatus.DRAFT, user) : pressReleaseRepository.countByStatusAndCreatedBy(PressReleaseStatus.DRAFT, user);
        long rejectedPressReleases = isAdmin ? pressReleaseRepository.countByStatus(PressReleaseStatus.REJECTED) : pressReleaseRepository.countByStatusAndCreatedBy(PressReleaseStatus.REJECTED, user);
        long archivedPressReleases = isAdmin ? pressReleaseRepository.countByStatus(PressReleaseStatus.ARCHIVED) : pressReleaseRepository.countByStatusAndCreatedBy(PressReleaseStatus.ARCHIVED, user);
        long pendingPressReleases = isAdmin ? pressReleaseRepository.countByStatus(PressReleaseStatus.PENDING) : pressReleaseRepository.countByStatusAndCreatedBy(PressReleaseStatus.PENDING, user);

        // Kullanıcı sayıları
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.count(); // Geliştirilebilir: aktif kullanıcılar için ek alan gerekebilir

        // Son kullanıcılar
        List<User> recentUsers = isAdmin ? userRepository.findTop5ByOrderByIdDesc() : List.of(user);
        List<DashboardSummaryResponse.UserSummary> recentUserSummaries = recentUsers.stream().map(u ->
                new DashboardSummaryResponse.UserSummary(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getRole(),
                        "-"
                )
        ).collect(Collectors.toList());

        // Son bültenler
        List<PressRelease> recentPressReleases = isAdmin ? pressReleaseRepository.findTop5ByOrderByIdDesc() : pressReleaseRepository.findTop5ByCreatedByOrderByIdDesc(user);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        List<DashboardSummaryResponse.PressReleaseSummary> recentPressReleaseSummaries = recentPressReleases.stream().map(pr ->
                new DashboardSummaryResponse.PressReleaseSummary(
                        pr.getId(),
                        pr.getTitle(),
                        pr.getStatus(),
                        pr.getCreatedBy().getName(),
                        pr.getCreatedAt() != null ? pr.getCreatedAt().format(formatter) : "-"
                )
        ).collect(Collectors.toList());

        return new DashboardSummaryResponse(
                totalPressReleases,
                publishedPressReleases,
                draftPressReleases,
                rejectedPressReleases,
                archivedPressReleases,
                pendingPressReleases,
                totalUsers,
                activeUsers,
                recentUserSummaries,
                recentPressReleaseSummaries
        );
    }
} 