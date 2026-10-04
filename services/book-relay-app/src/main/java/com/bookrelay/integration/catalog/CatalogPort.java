package com.bookrelay.integration.catalog;

import com.bookrelay.catalog.entity.BookStatus;
import java.util.UUID;

/**
 * Boundary for lending to interact with catalog without HTTP.
 * Microservice extraction: implement with RestTemplate/WebClient calling catalog-service.
 */
public interface CatalogPort {

    BookInfo getBook(UUID bookId);

    void updateBookStatus(UUID bookId, BookStatus status);

    record BookInfo(UUID id, UUID ownerId, String title, BookStatus status) {}
}
