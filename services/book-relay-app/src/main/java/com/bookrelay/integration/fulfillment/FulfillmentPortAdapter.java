package com.bookrelay.integration.fulfillment;

import com.bookrelay.fulfillment.service.FulfillmentService;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class FulfillmentPortAdapter implements FulfillmentPort {

    private final FulfillmentService fulfillmentService;

    public FulfillmentPortAdapter(FulfillmentService fulfillmentService) {
        this.fulfillmentService = fulfillmentService;
    }

    @Override
    public void createDraft(UUID loanId) {
        fulfillmentService.createDraft(loanId);
    }
}
