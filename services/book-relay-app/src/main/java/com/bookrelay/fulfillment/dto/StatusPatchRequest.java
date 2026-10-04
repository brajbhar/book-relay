package com.bookrelay.fulfillment.dto;

import com.bookrelay.fulfillment.entity.FulfillmentStatus;
import jakarta.validation.constraints.NotNull;

public record StatusPatchRequest(@NotNull FulfillmentStatus status) {}
