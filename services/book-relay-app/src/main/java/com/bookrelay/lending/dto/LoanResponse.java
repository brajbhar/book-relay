package com.bookrelay.lending.dto;

import com.bookrelay.lending.entity.LoanStatus;
import java.time.Instant;
import java.util.UUID;

public record LoanResponse(
        UUID id,
        UUID borrowRequestId,
        UUID bookId,
        UUID borrowerId,
        UUID lenderId,
        LoanStatus status,
        Instant borrowedAt,
        Instant dueAt,
        Instant returnedAt) {}
