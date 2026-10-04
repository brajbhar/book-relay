package com.bookrelay.catalog.dto;

import com.bookrelay.catalog.entity.BookStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(@NotNull BookStatus status) {}
