package com.bookrelay.lending.dto;

import com.bookrelay.lending.entity.BorrowRequestStatus;
import java.time.Instant;
import java.util.UUID;

public record BorrowRequestResponse(
        UUID id,
        UUID bookId,
        UUID borrowerId,
        UUID lenderId,
        String message,
        BorrowRequestStatus status,
        Instant createdAt) {}
