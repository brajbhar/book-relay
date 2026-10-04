package com.bookrelay.integration.fulfillment;

import java.util.UUID;

/**
 * Boundary for lending to start fulfillment workflow.
 * Microservice extraction: call fulfillment-service REST API.
 */
public interface FulfillmentPort {

    void createDraft(UUID loanId);
}
