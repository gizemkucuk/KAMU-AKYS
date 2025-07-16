package com.kamu.basinbulteni.dto;

import com.kamu.basinbulteni.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String name;
    private String email;
    private Role role;
} 