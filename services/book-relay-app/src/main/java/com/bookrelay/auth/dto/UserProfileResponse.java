package com.bookrelay.auth.dto;

import java.time.Instant;
import java.util.UUID;

public record UserProfileResponse(
        UUID id, String email, String displayName, String phone, Instant createdAt) {}
