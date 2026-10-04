package com.bookrelay.catalog.dto;

import com.bookrelay.catalog.entity.BookCondition;
import com.bookrelay.catalog.entity.BookStatus;
import java.time.Instant;
import java.util.UUID;

public record BookResponse(
        UUID id,
        UUID ownerId,
        String ownerDisplayName,
        String ownerPostalCode,
        String title,
        String author,
        String isbn,
        String description,
        BookCondition condition,
        String coverImageUrl,
        BookStatus status,
        Instant createdAt,
        Instant updatedAt) {}
