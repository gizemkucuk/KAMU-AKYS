package com.kamu.basinbulteni.service;

import com.kamu.basinbulteni.dto.PressReleaseRequest;
import com.kamu.basinbulteni.dto.PressReleaseResponse;
import com.kamu.basinbulteni.model.PressRelease;
import com.kamu.basinbulteni.model.PressReleaseStatus;
import com.kamu.basinbulteni.model.Role;
import com.kamu.basinbulteni.model.User;
import com.kamu.basinbulteni.repository.PressReleaseRepository;
import com.kamu.basinbulteni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PressReleaseService {
    
    private final PressReleaseRepository pressReleaseRepository;
    private final UserRepository userRepository;
    
    public PressReleaseResponse createPressRelease(PressReleaseRequest request, String userEmail) {
        User user = userRepository.findByUsernameOrEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));
        
        PressRelease pressRelease = new PressRelease();
        pressRelease.setTitle(request.getTitle());
        pressRelease.setContent(request.getContent());
        pressRelease.setStatus(PressReleaseStatus.DRAFT);
        pressRelease.setCreatedBy(user);
        
        PressRelease savedPressRelease = pressReleaseRepository.save(pressRelease);
        return mapToResponse(savedPressRelease);
    }
    
    public Page<PressReleaseResponse> getAllPressReleases(String userEmail, String title, PressReleaseStatus status, Pageable pageable, boolean onlyMine) {
        User user = userRepository.findByUsernameOrEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));
        Page<PressRelease> pressReleases;
        if (onlyMine) {
            if (title != null && !title.isEmpty() && status != null) {
                pressReleases = pressReleaseRepository.findByCreatedByAndStatusAndTitleContaining(user, status, title, pageable);
            } else if (title != null && !title.isEmpty()) {
                pressReleases = pressReleaseRepository.findByCreatedByAndTitleContaining(user, title, pageable);
            } else if (status != null) {
                pressReleases = pressReleaseRepository.findByCreatedByAndStatus(user, status, pageable);
            } else {
                pressReleases = pressReleaseRepository.findByCreatedBy(user, pageable);
            }
        } else if (user.getRole() == Role.ADMIN) {
            if (title != null && !title.isEmpty() && status != null) {
                pressReleases = pressReleaseRepository.findAllExceptDraftByStatusAndTitle(status, title, pageable);
            } else if (title != null && !title.isEmpty()) {
                pressReleases = pressReleaseRepository.findAllExceptDraftByTitle(title, pageable);
            } else if (status != null) {
                pressReleases = pressReleaseRepository.findAllExceptDraftByStatus(status, pageable);
            } else {
                pressReleases = pressReleaseRepository.findAllExceptDraft(pageable);
            }
        } else {
            if (title != null && !title.isEmpty() && status != null) {
                pressReleases = pressReleaseRepository.findVisibleToUserByStatusAndTitle(user, status, title, pageable);
            } else if (title != null && !title.isEmpty()) {
                pressReleases = pressReleaseRepository.findVisibleToUserByTitle(user, title, pageable);
            } else if (status != null) {
                pressReleases = pressReleaseRepository.findVisibleToUserByStatus(user, status, pageable);
            } else {
                pressReleases = pressReleaseRepository.findVisibleToUser(user, pageable);
            }
        }
        return pressReleases.map(this::mapToResponse);
    }
    
    public PressReleaseResponse getPressReleaseById(Long id, String userEmail) {
        User user = userRepository.findByUsernameOrEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));
        
        PressRelease pressRelease = pressReleaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Basın bülteni bulunamadı"));
        
        if (user.getRole() != Role.ADMIN && !pressRelease.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Bu basın bültenine erişim yetkiniz yok");
        }
        
        return mapToResponse(pressRelease);
    }
    
    public PressReleaseResponse updatePressRelease(Long id, PressReleaseRequest request, String userEmail) {
        User user = userRepository.findByUsernameOrEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));
        
        PressRelease pressRelease = pressReleaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Basın bülteni bulunamadı"));
        
        if (user.getRole() != Role.ADMIN && !pressRelease.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Bu basın bültenini düzenleme yetkiniz yok");
        }
        
        pressRelease.setTitle(request.getTitle());
        pressRelease.setContent(request.getContent());
        
        PressRelease updatedPressRelease = pressReleaseRepository.save(pressRelease);
        return mapToResponse(updatedPressRelease);
    }
    
    public void deletePressRelease(Long id, String userEmail) {
        User user = userRepository.findByUsernameOrEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));
        
        PressRelease pressRelease = pressReleaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Basın bülteni bulunamadı"));
        
        if (user.getRole() != Role.ADMIN && !pressRelease.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Bu basın bültenini silme yetkiniz yok");
        }
        
        pressReleaseRepository.delete(pressRelease);
    }
    
    public PressReleaseResponse updateStatus(Long id, PressReleaseStatus status, String userEmail) {
        User user = userRepository.findByUsernameOrEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));
        
        PressRelease pressRelease = pressReleaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Basın bülteni bulunamadı"));
        
        if (user.getRole() != Role.ADMIN && !pressRelease.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Bu basın bültenini güncelleme yetkiniz yok");
        }
        
        pressRelease.setStatus(status);
        PressRelease updatedPressRelease = pressReleaseRepository.save(pressRelease);
        return mapToResponse(updatedPressRelease);
    }
    
    public PressReleaseResponse submitForApproval(Long id, String userEmail) {
        User user = userRepository.findByUsernameOrEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));
        
        PressRelease pressRelease = pressReleaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Basın bülteni bulunamadı"));
        
        if (!pressRelease.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Bu basın bültenini onaya sunma yetkiniz yok");
        }
        
        if (pressRelease.getStatus() != PressReleaseStatus.DRAFT) {
            throw new RuntimeException("Sadece taslak durumundaki bültenler onaya sunulabilir");
        }
        
        pressRelease.setStatus(PressReleaseStatus.PENDING);
        PressRelease updatedPressRelease = pressReleaseRepository.save(pressRelease);
        return mapToResponse(updatedPressRelease);
    }
    
    public PressReleaseResponse approvePressRelease(Long id, String userEmail) {
        User user = userRepository.findByUsernameOrEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));
        
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Bu işlem için admin yetkisi gereklidir");
        }
        
        PressRelease pressRelease = pressReleaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Basın bülteni bulunamadı"));
        
        if (pressRelease.getStatus() != PressReleaseStatus.PENDING) {
            throw new RuntimeException("Sadece onay bekleyen bültenler onaylanabilir");
        }
        
        pressRelease.setStatus(PressReleaseStatus.PUBLISHED);
        PressRelease updatedPressRelease = pressReleaseRepository.save(pressRelease);
        return mapToResponse(updatedPressRelease);
    }
    
    public PressReleaseResponse rejectPressRelease(Long id, String userEmail) {
        User user = userRepository.findByUsernameOrEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));
        
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Bu işlem için admin yetkisi gereklidir");
        }
        
        PressRelease pressRelease = pressReleaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Basın bülteni bulunamadı"));
        
        if (pressRelease.getStatus() != PressReleaseStatus.PENDING) {
            throw new RuntimeException("Sadece onay bekleyen bültenler reddedilebilir");
        }
        
        pressRelease.setStatus(PressReleaseStatus.REJECTED);
        PressRelease updatedPressRelease = pressReleaseRepository.save(pressRelease);
        return mapToResponse(updatedPressRelease);
    }
    
    public Page<PressReleaseResponse> getPendingPressReleases(String userEmail, Pageable pageable) {
        User user = userRepository.findByUsernameOrEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));
        
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Bu işlem için admin yetkisi gereklidir");
        }
        
        Page<PressRelease> pendingPressReleases = pressReleaseRepository.findByStatus(PressReleaseStatus.PENDING, pageable);
        return pendingPressReleases.map(this::mapToResponse);
    }
    
    private PressReleaseResponse mapToResponse(PressRelease pressRelease) {
        return new PressReleaseResponse(
                pressRelease.getId(),
                pressRelease.getTitle(),
                pressRelease.getContent(),
                pressRelease.getStatus(),
                pressRelease.getCreatedBy().getName(),
                pressRelease.getCreatedAt(),
                pressRelease.getUpdatedAt()
        );
    }
} 