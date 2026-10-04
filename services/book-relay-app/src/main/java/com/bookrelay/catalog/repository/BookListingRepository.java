package com.bookrelay.catalog.repository;

import com.bookrelay.catalog.entity.BookListing;
import com.bookrelay.catalog.entity.BookStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookListingRepository extends JpaRepository<BookListing, UUID> {

    List<BookListing> findByOwnerId(UUID ownerId);

    @Query("SELECT b FROM BookListing b WHERE b.status = :status "
            + "AND (:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) "
            + "AND (:author IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))) "
            + "AND (:postalCode IS NULL OR b.ownerPostalCode = :postalCode)")
    List<BookListing> search(
            @Param("status") BookStatus status,
            @Param("title") String title,
            @Param("author") String author,
            @Param("postalCode") String postalCode);
}
