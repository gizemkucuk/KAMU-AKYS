package com.kamu.basinbulteni.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    @NotBlank(message = "Ad alanı boş olamaz")
    private String name;
    
    @NotBlank(message = "Kullanıcı adı alanı boş olamaz")
    @Size(min = 3, message = "Kullanıcı adı en az 3 karakter olmalıdır")
    private String username;
    
    @NotBlank(message = "Email alanı boş olamaz")
    @Email(message = "Geçerli bir email adresi giriniz")
    private String email;
    
    @NotBlank(message = "Şifre alanı boş olamaz")
    @Size(min = 6, message = "Şifre en az 6 karakter olmalıdır")
    private String password;
} 