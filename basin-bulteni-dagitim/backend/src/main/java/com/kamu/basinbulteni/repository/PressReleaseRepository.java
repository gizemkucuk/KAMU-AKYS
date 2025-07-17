package com.kamu.basinbulteni.repository;

import com.kamu.basinbulteni.model.PressRelease;
import com.kamu.basinbulteni.model.PressReleaseStatus;
import com.kamu.basinbulteni.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PressReleaseRepository extends JpaRepository<PressRelease, Long> {
    
    Page<PressRelease> findByCreatedBy(User createdBy, Pageable pageable);
    
    Page<PressRelease> findByStatus(PressReleaseStatus status, Pageable pageable);
    
    Page<PressRelease> findByCreatedByAndStatus(User createdBy, PressReleaseStatus status, Pageable pageable);
    
    @Query("SELECT pr FROM PressRelease pr WHERE pr.title LIKE %:title%")
    Page<PressRelease> findByTitleContaining(@Param("title") String title, Pageable pageable);
    
    @Query("SELECT pr FROM PressRelease pr WHERE pr.createdBy = :user AND pr.title LIKE %:title%")
    Page<PressRelease> findByCreatedByAndTitleContaining(@Param("user") User user, @Param("title") String title, Pageable pageable);
    
    @Query("SELECT pr FROM PressRelease pr WHERE pr.title LIKE %:title% AND pr.status = :status")
    Page<PressRelease> findByTitleContainingAndStatus(@Param("title") String title, @Param("status") PressReleaseStatus status, Pageable pageable);
    
    @Query("SELECT pr FROM PressRelease pr WHERE pr.createdBy = :user AND pr.status = :status AND pr.title LIKE %:title%")
    Page<PressRelease> findByCreatedByAndStatusAndTitleContaining(@Param("user") User user, @Param("status") PressReleaseStatus status, @Param("title") String title, Pageable pageable);
    
    long countByStatus(PressReleaseStatus status);
    
    long countByCreatedBy(User createdBy);

    @Query("SELECT COUNT(pr) FROM PressRelease pr WHERE pr.status = :status AND (pr.createdBy = :user OR pr.status = 'PUBLISHED')")
    long countByStatusAndCreatedByOrPublished(@Param("status") PressReleaseStatus status, @Param("user") User user);

    long countByStatusAndCreatedBy(PressReleaseStatus status, User createdBy);

    @Query("SELECT pr FROM PressRelease pr WHERE (pr.createdBy = :user) OR (pr.status = 'PUBLISHED')")
    Page<PressRelease> findVisibleToUser(@Param("user") User user, Pageable pageable);

    @Query("SELECT pr FROM PressRelease pr WHERE ((pr.createdBy = :user) OR (pr.status = 'PUBLISHED')) AND pr.title LIKE %:title%")
    Page<PressRelease> findVisibleToUserByTitle(@Param("user") User user, @Param("title") String title, Pageable pageable);

    @Query("SELECT pr FROM PressRelease pr WHERE (pr.status = 'PUBLISHED') OR (pr.createdBy = :user AND pr.status = :status)")
    Page<PressRelease> findVisibleToUserByStatus(@Param("user") User user, @Param("status") PressReleaseStatus status, Pageable pageable);

    @Query("SELECT pr FROM PressRelease pr WHERE ((pr.status = 'PUBLISHED') OR (pr.createdBy = :user AND pr.status = :status)) AND pr.title LIKE %:title%")
    Page<PressRelease> findVisibleToUserByStatusAndTitle(@Param("user") User user, @Param("status") PressReleaseStatus status, @Param("title") String title, Pageable pageable);

    @Query("SELECT pr FROM PressRelease pr WHERE pr.status <> 'DRAFT'")
    Page<PressRelease> findAllExceptDraft(Pageable pageable);

    @Query("SELECT pr FROM PressRelease pr WHERE pr.status <> 'DRAFT' AND pr.title LIKE %:title%")
    Page<PressRelease> findAllExceptDraftByTitle(@Param("title") String title, Pageable pageable);

    @Query("SELECT pr FROM PressRelease pr WHERE pr.status = :status AND pr.status <> 'DRAFT'")
    Page<PressRelease> findAllExceptDraftByStatus(@Param("status") PressReleaseStatus status, Pageable pageable);

    @Query("SELECT pr FROM PressRelease pr WHERE pr.status = :status AND pr.status <> 'DRAFT' AND pr.title LIKE %:title%")
    Page<PressRelease> findAllExceptDraftByStatusAndTitle(@Param("status") PressReleaseStatus status, @Param("title") String title, Pageable pageable);

    // Admin kullanıcılar için tüm bültenleri (taslak dahil) getiren metodlar
    @Query("SELECT pr FROM PressRelease pr")
    Page<PressRelease> findAllForAdmin(Pageable pageable);

    @Query("SELECT pr FROM PressRelease pr WHERE pr.title LIKE %:title%")
    Page<PressRelease> findAllForAdminByTitle(@Param("title") String title, Pageable pageable);

    @Query("SELECT pr FROM PressRelease pr WHERE pr.status = :status")
    Page<PressRelease> findAllForAdminByStatus(@Param("status") PressReleaseStatus status, Pageable pageable);

    @Query("SELECT pr FROM PressRelease pr WHERE pr.status = :status AND pr.title LIKE %:title%")
    Page<PressRelease> findAllForAdminByStatusAndTitle(@Param("status") PressReleaseStatus status, @Param("title") String title, Pageable pageable);

    List<PressRelease> findTop5ByOrderByIdDesc();
    List<PressRelease> findTop5ByCreatedByOrderByIdDesc(User createdBy);
} 