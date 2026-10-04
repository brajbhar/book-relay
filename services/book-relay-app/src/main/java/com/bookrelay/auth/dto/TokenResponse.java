package com.bookrelay.auth.dto;

public record TokenResponse(String accessToken, long expiresIn) {}
