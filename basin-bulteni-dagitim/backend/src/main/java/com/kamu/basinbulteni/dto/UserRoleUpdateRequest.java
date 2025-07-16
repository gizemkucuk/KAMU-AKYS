package com.kamu.basinbulteni.dto;

import com.kamu.basinbulteni.model.Role;
import lombok.Data;

@Data
public class UserRoleUpdateRequest {
    private Role role;
} 