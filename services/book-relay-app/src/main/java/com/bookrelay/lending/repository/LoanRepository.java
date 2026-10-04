package com.bookrelay.lending.repository;

import com.bookrelay.lending.entity.Loan;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan, UUID> {

    List<Loan> findByBorrowerIdOrLenderId(UUID borrowerId, UUID lenderId);

    Optional<Loan> findByIdAndLenderId(UUID id, UUID lenderId);

    Optional<Loan> findByIdAndBorrowerId(UUID id, UUID borrowerId);
}
