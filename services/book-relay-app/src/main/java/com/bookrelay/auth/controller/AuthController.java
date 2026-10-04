package com.bookrelay.auth.controller;

import com.bookrelay.auth.dto.AddressRequest;
import com.bookrelay.auth.dto.AddressResponse;
import com.bookrelay.auth.dto.LoginRequest;
import com.bookrelay.auth.dto.RegisterRequest;
import com.bookrelay.auth.dto.TokenResponse;
import com.bookrelay.auth.dto.UpdateProfileRequest;
import com.bookrelay.auth.dto.UserProfileResponse;
import com.bookrelay.auth.service.AuthService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserProfileResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserProfileResponse me(Authentication authentication) {
        return authService.getProfile(userId(authentication));
    }

    @PutMapping("/me")
    public UserProfileResponse updateMe(
            Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        return authService.updateProfile(userId(authentication), request);
    }

    @GetMapping("/addresses")
    public List<AddressResponse> listAddresses(Authentication authentication) {
        return authService.listAddresses(userId(authentication));
    }

    @PostMapping("/addresses")
    public AddressResponse createAddress(
            Authentication authentication, @Valid @RequestBody AddressRequest request) {
        return authService.createAddress(userId(authentication), request);
    }

    @PutMapping("/addresses/{id}")
    public AddressResponse updateAddress(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody AddressRequest request) {
        return authService.updateAddress(userId(authentication), id, request);
    }

    @DeleteMapping("/addresses/{id}")
    public void deleteAddress(Authentication authentication, @PathVariable UUID id) {
        authService.deleteAddress(userId(authentication), id);
    }

    @GetMapping("/users/{id}")
    public UserProfileResponse getUser(@PathVariable UUID id) {
        return authService.getUserById(id);
    }

    private UUID userId(Authentication authentication) {
        return (UUID) authentication.getPrincipal();
    }
}
