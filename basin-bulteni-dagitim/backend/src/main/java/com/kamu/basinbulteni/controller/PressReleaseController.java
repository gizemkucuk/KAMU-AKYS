package com.kamu.basinbulteni.controller;

import com.kamu.basinbulteni.dto.PressReleaseRequest;
import com.kamu.basinbulteni.dto.PressReleaseResponse;
import com.kamu.basinbulteni.model.PressReleaseStatus;
import com.kamu.basinbulteni.service.PressReleaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/press-releases")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PressReleaseController {
    
    private final PressReleaseService pressReleaseService;
    
    @PostMapping
    public ResponseEntity<PressReleaseResponse> createPressRelease(
            @Valid @RequestBody PressReleaseRequest request,
            Authentication authentication) {
        PressReleaseResponse response = pressReleaseService.createPressRelease(request, authentication.getName());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<Page<PressReleaseResponse>> getAllPressReleases(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) PressReleaseStatus status,
            @RequestParam(required = false, defaultValue = "false") boolean onlyMine,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PressReleaseResponse> response = pressReleaseService.getAllPressReleases(
                authentication.getName(), title, status, pageable, onlyMine);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PressReleaseResponse> getPressReleaseById(
            @PathVariable Long id,
            Authentication authentication) {
        PressReleaseResponse response = pressReleaseService.getPressReleaseById(id, authentication.getName());
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PressReleaseResponse> updatePressRelease(
            @PathVariable Long id,
            @Valid @RequestBody PressReleaseRequest request,
            Authentication authentication) {
        PressReleaseResponse response = pressReleaseService.updatePressRelease(id, request, authentication.getName());
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePressRelease(
            @PathVariable Long id,
            Authentication authentication) {
        pressReleaseService.deletePressRelease(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<PressReleaseResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam PressReleaseStatus status,
            Authentication authentication) {
        PressReleaseResponse response = pressReleaseService.updateStatus(id, status, authentication.getName());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/submit")
    public ResponseEntity<PressReleaseResponse> submitForApproval(
            @PathVariable Long id,
            Authentication authentication) {
        PressReleaseResponse response = pressReleaseService.submitForApproval(id, authentication.getName());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/approve")
    public ResponseEntity<PressReleaseResponse> approvePressRelease(
            @PathVariable Long id,
            Authentication authentication) {
        PressReleaseResponse response = pressReleaseService.approvePressRelease(id, authentication.getName());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/reject")
    public ResponseEntity<PressReleaseResponse> rejectPressRelease(
            @PathVariable Long id,
            Authentication authentication) {
        PressReleaseResponse response = pressReleaseService.rejectPressRelease(id, authentication.getName());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<Page<PressReleaseResponse>> getPendingPressReleases(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PressReleaseResponse> response = pressReleaseService.getPendingPressReleases(authentication.getName(), pageable);
        return ResponseEntity.ok(response);
    }
} 