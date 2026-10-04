package com.bookrelay.fulfillment.dto;

import com.bookrelay.fulfillment.entity.FulfillmentType;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateFulfillmentRequest(@NotNull UUID loanId, @NotNull FulfillmentType type) {}
