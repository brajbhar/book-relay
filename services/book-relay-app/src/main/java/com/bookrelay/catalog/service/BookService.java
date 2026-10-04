package com.bookrelay.catalog.service;

import com.bookrelay.integration.auth.AuthUserPort;
import com.bookrelay.catalog.dto.BookRequest;
import com.bookrelay.catalog.dto.BookResponse;
import com.bookrelay.catalog.entity.BookListing;
import com.bookrelay.catalog.entity.BookStatus;
import com.bookrelay.catalog.repository.BookListingRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BookService {

    private final BookListingRepository repository;
    private final AuthUserPort authUserPort;

    public BookService(BookListingRepository repository, AuthUserPort authUserPort) {
        this.repository = repository;
        this.authUserPort = authUserPort;
    }

    public List<BookResponse> browse(String title, String author, String postalCode) {
        return repository
                .search(BookStatus.AVAILABLE, emptyToNull(title), emptyToNull(author), emptyToNull(postalCode))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public BookResponse getById(UUID id) {
        return toResponse(findBook(id));
    }

    public List<BookResponse> myListings(UUID ownerId) {
        return repository.findByOwnerId(ownerId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public BookResponse create(UUID ownerId, BookRequest request) {
        AuthUserPort.UserInfo owner = authUserPort.fetchUser(ownerId);
        if (owner.postalCode() == null || owner.postalCode().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Add a default address on your profile before listing a book");
        }
        BookListing book = new BookListing();
        book.setOwnerId(ownerId);
        book.setOwnerDisplayName(owner.displayName());
        book.setOwnerPostalCode(owner.postalCode());
        applyRequest(book, request);
        book.setStatus(BookStatus.AVAILABLE);
        return toResponse(repository.save(book));
    }

    @Transactional
    public BookResponse update(UUID ownerId, UUID id, BookRequest request) {
        BookListing book = findBook(id);
        if (!book.getOwnerId().equals(ownerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not the book owner");
        }
        applyRequest(book, request);
        book.setUpdatedAt(Instant.now());
        AuthUserPort.UserInfo owner = authUserPort.fetchUser(ownerId);
        book.setOwnerDisplayName(owner.displayName());
        book.setOwnerPostalCode(owner.postalCode());
        return toResponse(repository.save(book));
    }

    @Transactional
    public void delete(UUID ownerId, UUID id) {
        BookListing book = findBook(id);
        if (!book.getOwnerId().equals(ownerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not the book owner");
        }
        book.setStatus(BookStatus.UNLISTED);
        book.setUpdatedAt(Instant.now());
        repository.save(book);
    }

    @Transactional
    public BookResponse updateStatus(UUID id, BookStatus status) {
        BookListing book = findBook(id);
        book.setStatus(status);
        book.setUpdatedAt(Instant.now());
        return toResponse(repository.save(book));
    }

    private void applyRequest(BookListing book, BookRequest request) {
        book.setTitle(request.title().trim());
        book.setAuthor(emptyToNull(request.author()));
        book.setIsbn(emptyToNull(request.isbn()));
        book.setDescription(emptyToNull(request.description()));
        if (request.condition() != null) {
            book.setCondition(request.condition());
        }
        book.setCoverImageUrl(emptyToNull(request.coverImageUrl()));
    }

    private BookListing findBook(UUID id) {
        return repository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));
    }

    private BookResponse toResponse(BookListing b) {
        return new BookResponse(
                b.getId(),
                b.getOwnerId(),
                b.getOwnerDisplayName(),
                b.getOwnerPostalCode(),
                b.getTitle(),
                b.getAuthor(),
                b.getIsbn(),
                b.getDescription(),
                b.getCondition(),
                b.getCoverImageUrl(),
                b.getStatus(),
                b.getCreatedAt(),
                b.getUpdatedAt());
    }

    private String emptyToNull(String s) {
        return s == null || s.isBlank() ? null : s;
    }
}
