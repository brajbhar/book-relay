package com.bookrelay.lending.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateBorrowRequest(
        @NotNull UUID bookId, @Size(max = 500) String message) {}
