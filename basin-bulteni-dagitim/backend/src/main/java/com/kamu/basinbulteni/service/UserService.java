package com.kamu.basinbulteni.service;

import com.kamu.basinbulteni.dto.UserListResponse;
import com.kamu.basinbulteni.dto.UserRoleUpdateRequest;
import com.kamu.basinbulteni.model.Role;
import com.kamu.basinbulteni.model.User;
import com.kamu.basinbulteni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<UserListResponse> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            UserListResponse dto = new UserListResponse();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setUsername(user.getUsername());
            dto.setRole(user.getRole());
            dto.setStatus(user.isEnabled() ? "active" : "inactive");
            dto.setLastLogin(null); // Not available in User entity
            dto.setCreatedAt(null); // Not available in User entity
            dto.setPressReleaseCount(0); // Not available in User entity
            return dto;
        }).collect(Collectors.toList());
    }

    public void updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        user.setRole(newRole);
        userRepository.save(user);
    }
} 