package com.bookrelay.auth.dto;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(@Size(max = 100) String displayName, @Size(max = 20) String phone) {}
