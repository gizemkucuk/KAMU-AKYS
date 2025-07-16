package com.kamu.basinbulteni.service;

import com.kamu.basinbulteni.dto.AuthRequest;
import com.kamu.basinbulteni.dto.AuthResponse;
import com.kamu.basinbulteni.dto.RegisterRequest;
import com.kamu.basinbulteni.model.Role;
import com.kamu.basinbulteni.model.User;
import com.kamu.basinbulteni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Bu kullanıcı adı zaten kullanılıyor");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Bu email adresi zaten kullanılıyor");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        
        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);
        
        return new AuthResponse(token, savedUser.getUsername(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole());
    }
    
    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        User user = userRepository.findByUsernameOrEmail(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        String token = jwtService.generateToken(user);
        
        return new AuthResponse(token, user.getUsername(), user.getName(), user.getEmail(), user.getRole());
    }
} 