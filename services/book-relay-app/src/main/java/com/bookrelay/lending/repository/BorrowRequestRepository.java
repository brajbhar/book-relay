package com.bookrelay.lending.repository;

import com.bookrelay.lending.entity.BorrowRequest;
import com.bookrelay.lending.entity.BorrowRequestStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, UUID> {

    List<BorrowRequest> findByLenderId(UUID lenderId);

    List<BorrowRequest> findByBorrowerId(UUID borrowerId);

    boolean existsByBookIdAndBorrowerIdAndStatus(UUID bookId, UUID borrowerId, BorrowRequestStatus status);

    Optional<BorrowRequest> findByIdAndLenderId(UUID id, UUID lenderId);

    Optional<BorrowRequest> findByIdAndBorrowerId(UUID id, UUID borrowerId);
}
