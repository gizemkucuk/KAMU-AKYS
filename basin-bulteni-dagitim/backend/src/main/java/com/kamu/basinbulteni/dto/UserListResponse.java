package com.kamu.basinbulteni.dto;

import com.kamu.basinbulteni.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserListResponse {
    private Long id;
    private String name;
    private String email;
    private String username;
    private Role role;
    private String status;
    private String lastLogin;
    private String createdAt;
    private int pressReleaseCount;
} 