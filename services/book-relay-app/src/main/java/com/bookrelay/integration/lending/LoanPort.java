package com.bookrelay.integration.lending;

import java.util.UUID;

/**
 * Boundary for fulfillment to check loan participants without HTTP.
 * Microservice extraction: implement with RestTemplate/WebClient calling lending-service.
 */
public interface LoanPort {

    boolean isParticipant(UUID loanId, UUID userId);
}
