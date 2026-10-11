package com.bookrelay.auth.dto;

import java.time.Instant;
import java.util.UUID;

public record PublicUserResponse(UUID id, String displayName, Instant createdAt) {}
