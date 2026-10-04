package com.bookrelay.catalog.dto;

import com.bookrelay.catalog.entity.BookCondition;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BookRequest(
        @NotBlank @Size(max = 300) String title,
        @Size(max = 200) String author,
        @Size(max = 20) String isbn,
        @Size(max = 2000) String description,
        BookCondition condition,
        @Size(max = 500) String coverImageUrl) {}
