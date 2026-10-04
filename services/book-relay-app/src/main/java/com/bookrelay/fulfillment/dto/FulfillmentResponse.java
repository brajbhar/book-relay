package com.bookrelay.fulfillment.dto;

import com.bookrelay.fulfillment.entity.FulfillmentStatus;
import com.bookrelay.fulfillment.entity.FulfillmentType;
import java.time.Instant;
import java.util.UUID;

public record FulfillmentResponse(
        UUID id,
        UUID loanId,
        FulfillmentType type,
        FulfillmentStatus status,
        Instant createdAt,
        MeetupResponse meetup,
        ShipmentResponse shipment) {

    public record MeetupResponse(
            String proposedLocation, Instant proposedAt, Instant confirmedAt, String notes) {}

    public record ShipmentResponse(
            UUID shipFromAddressId,
            UUID shipToAddressId,
            String carrier,
            String trackingNumber,
            Instant shippedAt,
            Instant deliveredAt) {}
}
