package com.bookrelay.fulfillment.repository;

import com.bookrelay.fulfillment.entity.Fulfillment;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FulfillmentRepository extends JpaRepository<Fulfillment, UUID> {

    Optional<Fulfillment> findByLoanId(UUID loanId);
}
