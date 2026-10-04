package com.bookrelay.fulfillment.dto;

import java.time.Instant;
import java.util.UUID;

public record ShipmentRequest(
        UUID shipFromAddressId,
        UUID shipToAddressId,
        String carrier,
        String trackingNumber,
        Instant shippedAt,
        Instant deliveredAt) {}
