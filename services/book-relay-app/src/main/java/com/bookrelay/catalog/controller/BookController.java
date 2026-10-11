package com.bookrelay.catalog.controller;

import com.bookrelay.catalog.dto.BookRequest;
import com.bookrelay.catalog.dto.BookResponse;
import com.bookrelay.catalog.dto.StatusUpdateRequest;
import com.bookrelay.catalog.service.BookService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<BookResponse> browse(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String postalCode) {
        return bookService.browse(title, author, postalCode);
    }

    @GetMapping("/mine")
    public List<BookResponse> mine(Authentication authentication) {
        return bookService.myListings(userId(authentication));
    }

    @GetMapping("/{id}")
    public BookResponse get(@PathVariable UUID id) {
        return bookService.getById(id);
    }

    @PostMapping
    public BookResponse create(Authentication authentication, @Valid @RequestBody BookRequest request) {
        return bookService.create(userId(authentication), request);
    }

    @PutMapping("/{id}")
    public BookResponse update(
            Authentication authentication, @PathVariable UUID id, @Valid @RequestBody BookRequest request) {
        return bookService.update(userId(authentication), id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(Authentication authentication, @PathVariable UUID id) {
        bookService.delete(userId(authentication), id);
    }

    @PatchMapping("/{id}/status")
    public BookResponse updateStatus(
            Authentication authentication, @PathVariable UUID id, @Valid @RequestBody StatusUpdateRequest request) {
        return bookService.updateStatusAsOwner(userId(authentication), id, request.status());
    }

    private UUID userId(Authentication authentication) {
        return (UUID) authentication.getPrincipal();
    }
}
