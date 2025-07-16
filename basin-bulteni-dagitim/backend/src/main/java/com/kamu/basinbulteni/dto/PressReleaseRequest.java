package com.kamu.basinbulteni.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PressReleaseRequest {
    
    @NotBlank(message = "Başlık alanı boş olamaz")
    private String title;
    
    @NotBlank(message = "İçerik alanı boş olamaz")
    private String content;
} 