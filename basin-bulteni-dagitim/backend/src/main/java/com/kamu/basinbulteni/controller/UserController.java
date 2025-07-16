package com.kamu.basinbulteni.controller;

import com.kamu.basinbulteni.dto.UserListResponse;
import com.kamu.basinbulteni.dto.UserRoleUpdateRequest;
import com.kamu.basinbulteni.model.Role;
import com.kamu.basinbulteni.model.User;
import com.kamu.basinbulteni.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserListResponse>> getAllUsers(Authentication authentication) {
        log.info("Getting all users...");
        
        // Manual role check
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            if (user.getRole() != Role.ADMIN) {
                return ResponseEntity.status(403).build();
            }
        } else {
            return ResponseEntity.status(403).build();
        }
        
        List<UserListResponse> users = userService.getAllUsers();
        log.info("Found {} users", users.size());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<Void> updateUserRole(@PathVariable Long id, @RequestBody UserRoleUpdateRequest request, Authentication authentication) {
        log.info("Updating user role for user ID: {} to role: {}", id, request.getRole());
        
        // Manual role check
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            if (user.getRole() != Role.ADMIN) {
                return ResponseEntity.status(403).build();
            }
        } else {
            return ResponseEntity.status(403).build();
        }
        
        userService.updateUserRole(id, request.getRole());
        return ResponseEntity.ok().build();
    }
} 