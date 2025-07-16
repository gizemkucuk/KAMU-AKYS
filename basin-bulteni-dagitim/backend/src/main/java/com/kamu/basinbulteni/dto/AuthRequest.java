package com.kamu.basinbulteni.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    
    @NotBlank(message = "Kullanıcı adı alanı boş olamaz")
    private String username;
    
    @NotBlank(message = "Şifre alanı boş olamaz")
    private String password;
} 