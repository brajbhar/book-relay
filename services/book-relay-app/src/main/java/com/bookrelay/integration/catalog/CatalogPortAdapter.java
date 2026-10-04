package com.bookrelay.integration.catalog;

import com.bookrelay.catalog.entity.BookStatus;
import com.bookrelay.catalog.service.BookService;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class CatalogPortAdapter implements CatalogPort {

    private final BookService bookService;

    public CatalogPortAdapter(BookService bookService) {
        this.bookService = bookService;
    }

    @Override
    public BookInfo getBook(UUID bookId) {
        var book = bookService.getById(bookId);
        return new BookInfo(book.id(), book.ownerId(), book.title(), book.status());
    }

    @Override
    public void updateBookStatus(UUID bookId, BookStatus status) {
        bookService.updateStatus(bookId, status);
    }
}
