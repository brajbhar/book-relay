package com.bookrelay.integration.lending;

import com.bookrelay.lending.repository.LoanRepository;
import java.util.UUID;
import org.springframework.stereotype.Component;

/** Reads the repository directly: LendingService depends on FulfillmentPort, so injecting it here would be circular. */
@Component
public class LoanPortAdapter implements LoanPort {

    private final LoanRepository loanRepository;

    public LoanPortAdapter(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    @Override
    public boolean isParticipant(UUID loanId, UUID userId) {
        return loanRepository
                .findById(loanId)
                .filter(l -> userId.equals(l.getBorrowerId()) || userId.equals(l.getLenderId()))
                .isPresent();
    }
}
