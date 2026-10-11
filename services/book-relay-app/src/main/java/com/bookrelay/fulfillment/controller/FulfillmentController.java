package com.bookrelay.fulfillment.controller;

import com.bookrelay.fulfillment.dto.CreateFulfillmentRequest;
import com.bookrelay.fulfillment.dto.FulfillmentResponse;
import com.bookrelay.fulfillment.dto.MeetupRequest;
import com.bookrelay.fulfillment.dto.ShipmentRequest;
import com.bookrelay.fulfillment.dto.StatusPatchRequest;
import com.bookrelay.fulfillment.service.FulfillmentService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fulfillment")
public class FulfillmentController {

    private final FulfillmentService fulfillmentService;

    public FulfillmentController(FulfillmentService fulfillmentService) {
        this.fulfillmentService = fulfillmentService;
    }

    @PostMapping
    public FulfillmentResponse create(Authentication auth, @Valid @RequestBody CreateFulfillmentRequest request) {
        return fulfillmentService.create(userId(auth), request);
    }

    @GetMapping("/loan/{loanId}")
    public FulfillmentResponse getByLoan(Authentication auth, @PathVariable UUID loanId) {
        return fulfillmentService.getByLoan(userId(auth), loanId);
    }

    @PutMapping("/{id}/meetup")
    public FulfillmentResponse updateMeetup(
            Authentication auth, @PathVariable UUID id, @RequestBody MeetupRequest request) {
        return fulfillmentService.updateMeetup(userId(auth), id, request);
    }

    @PutMapping("/{id}/shipment")
    public FulfillmentResponse updateShipment(
            Authentication auth, @PathVariable UUID id, @RequestBody ShipmentRequest request) {
        return fulfillmentService.updateShipment(userId(auth), id, request);
    }

    @PatchMapping("/{id}/status")
    public FulfillmentResponse patchStatus(
            Authentication auth, @PathVariable UUID id, @Valid @RequestBody StatusPatchRequest request) {
        return fulfillmentService.patchStatus(userId(auth), id, request);
    }

    private UUID userId(Authentication authentication) {
        return (UUID) authentication.getPrincipal();
    }
}
