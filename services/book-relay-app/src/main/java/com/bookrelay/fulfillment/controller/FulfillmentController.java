package com.bookrelay.fulfillment.controller;

import com.bookrelay.fulfillment.dto.CreateFulfillmentRequest;
import com.bookrelay.fulfillment.dto.FulfillmentResponse;
import com.bookrelay.fulfillment.dto.MeetupRequest;
import com.bookrelay.fulfillment.dto.ShipmentRequest;
import com.bookrelay.fulfillment.dto.StatusPatchRequest;
import com.bookrelay.fulfillment.service.FulfillmentService;
import jakarta.validation.Valid;
import java.util.UUID;
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
    public FulfillmentResponse create(@Valid @RequestBody CreateFulfillmentRequest request) {
        return fulfillmentService.create(request);
    }

    @GetMapping("/loan/{loanId}")
    public FulfillmentResponse getByLoan(@PathVariable UUID loanId) {
        return fulfillmentService.getByLoan(loanId);
    }

    @PutMapping("/{id}/meetup")
    public FulfillmentResponse updateMeetup(@PathVariable UUID id, @RequestBody MeetupRequest request) {
        return fulfillmentService.updateMeetup(id, request);
    }

    @PutMapping("/{id}/shipment")
    public FulfillmentResponse updateShipment(@PathVariable UUID id, @RequestBody ShipmentRequest request) {
        return fulfillmentService.updateShipment(id, request);
    }

    @PatchMapping("/{id}/status")
    public FulfillmentResponse patchStatus(@PathVariable UUID id, @Valid @RequestBody StatusPatchRequest request) {
        return fulfillmentService.patchStatus(id, request);
    }
}
