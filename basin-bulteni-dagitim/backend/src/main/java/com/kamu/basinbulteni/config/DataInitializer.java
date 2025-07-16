package com.kamu.basinbulteni.config;

import com.kamu.basinbulteni.model.Role;
import com.kamu.basinbulteni.model.User;
import com.kamu.basinbulteni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Default admin kullanıcısını oluştur
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User();
            adminUser.setName("Admin");
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole(Role.ADMIN);
            userRepository.save(adminUser);
            System.out.println("Default admin kullanıcısı oluşturuldu: admin/admin123");
        }
    }
} 