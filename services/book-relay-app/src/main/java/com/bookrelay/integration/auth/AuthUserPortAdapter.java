package com.bookrelay.integration.auth;

import com.bookrelay.auth.dto.AddressResponse;
import com.bookrelay.auth.service.AuthService;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class AuthUserPortAdapter implements AuthUserPort {

    private final AuthService authService;

    public AuthUserPortAdapter(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public UserInfo fetchUser(UUID userId) {
        var profile = authService.getUserById(userId);
        String postalCode = resolveDefaultPostal(userId);
        return new UserInfo(profile.displayName(), postalCode);
    }

    private String resolveDefaultPostal(UUID userId) {
        List<AddressResponse> addresses = authService.listAddresses(userId);
        if (addresses.isEmpty()) {
            return null;
        }
        return addresses.stream()
                .filter(AddressResponse::isDefault)
                .findFirst()
                .or(() -> addresses.stream().findFirst())
                .map(AddressResponse::postalCode)
                .orElse(null);
    }
}
