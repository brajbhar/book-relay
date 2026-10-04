package com.bookrelay.integration.auth;

import java.util.UUID;

/**
 * Anti-corruption boundary for catalog (and others) to read auth data without depending on auth internals.
 * Microservice extraction: replace {@link AuthUserPortAdapter} with an HTTP client implementation.
 */
public interface AuthUserPort {

    UserInfo fetchUser(UUID userId);

    record UserInfo(String displayName, String postalCode) {}
}
