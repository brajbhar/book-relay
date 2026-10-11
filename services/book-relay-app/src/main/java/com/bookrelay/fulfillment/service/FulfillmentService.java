package com.bookrelay.fulfillment.service;

import com.bookrelay.fulfillment.dto.CreateFulfillmentRequest;
import com.bookrelay.fulfillment.dto.FulfillmentResponse;
import com.bookrelay.fulfillment.dto.MeetupRequest;
import com.bookrelay.fulfillment.dto.ShipmentRequest;
import com.bookrelay.fulfillment.dto.StatusPatchRequest;
import com.bookrelay.fulfillment.entity.Fulfillment;
import com.bookrelay.fulfillment.entity.FulfillmentStatus;
import com.bookrelay.fulfillment.entity.FulfillmentType;
import com.bookrelay.fulfillment.entity.MeetupPlan;
import com.bookrelay.fulfillment.entity.ShipmentPlan;
import com.bookrelay.fulfillment.repository.FulfillmentRepository;
import com.bookrelay.fulfillment.repository.MeetupPlanRepository;
import com.bookrelay.fulfillment.repository.ShipmentPlanRepository;
import com.bookrelay.integration.lending.LoanPort;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FulfillmentService {

    private final FulfillmentRepository fulfillmentRepository;
    private final MeetupPlanRepository meetupPlanRepository;
    private final ShipmentPlanRepository shipmentPlanRepository;
    private final LoanPort loanPort;

    public FulfillmentService(
            FulfillmentRepository fulfillmentRepository,
            MeetupPlanRepository meetupPlanRepository,
            ShipmentPlanRepository shipmentPlanRepository,
            LoanPort loanPort) {
        this.fulfillmentRepository = fulfillmentRepository;
        this.meetupPlanRepository = meetupPlanRepository;
        this.shipmentPlanRepository = shipmentPlanRepository;
        this.loanPort = loanPort;
    }

    @Transactional
    public FulfillmentResponse createDraft(UUID loanId) {
        if (fulfillmentRepository.findByLoanId(loanId).isPresent()) {
            return toResponse(fulfillmentRepository.findByLoanId(loanId).get());
        }
        Fulfillment f = new Fulfillment();
        f.setLoanId(loanId);
        f.setStatus(FulfillmentStatus.DRAFT);
        return toResponse(fulfillmentRepository.save(f));
    }

    @Transactional
    public FulfillmentResponse create(UUID userId, CreateFulfillmentRequest request) {
        if (!loanPort.isParticipant(request.loanId(), userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Loan not found");
        }
        Fulfillment f = fulfillmentRepository
                .findByLoanId(request.loanId())
                .orElseGet(() -> {
                    Fulfillment n = new Fulfillment();
                    n.setLoanId(request.loanId());
                    return n;
                });
        f.setType(request.type());
        f.setStatus(FulfillmentStatus.PROPOSED);
        f = fulfillmentRepository.save(f);
        if (request.type() == FulfillmentType.MEETUP) {
            ensureMeetup(f);
        } else {
            ensureShipment(f);
        }
        return toResponse(f);
    }

    public FulfillmentResponse getByLoan(UUID userId, UUID loanId) {
        Fulfillment f = fulfillmentRepository
                .findByLoanId(loanId)
                .filter(found -> loanPort.isParticipant(found.getLoanId(), userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fulfillment not found"));
        return toResponse(f);
    }

    @Transactional
    public FulfillmentResponse updateMeetup(UUID userId, UUID id, MeetupRequest request) {
        Fulfillment f = findFulfillment(userId, id);
        if (f.getType() != FulfillmentType.MEETUP) {
            f.setType(FulfillmentType.MEETUP);
        }
        MeetupPlan plan = ensureMeetup(f);
        if (request.proposedLocation() != null) {
            plan.setProposedLocation(request.proposedLocation());
        }
        if (request.proposedAt() != null) {
            plan.setProposedAt(request.proposedAt());
        }
        if (request.confirmedAt() != null) {
            plan.setConfirmedAt(request.confirmedAt());
            f.setStatus(FulfillmentStatus.CONFIRMED);
        }
        if (request.notes() != null) {
            plan.setNotes(request.notes());
        }
        if (f.getStatus() == FulfillmentStatus.DRAFT) {
            f.setStatus(FulfillmentStatus.PROPOSED);
        }
        meetupPlanRepository.save(plan);
        fulfillmentRepository.save(f);
        return toResponse(f);
    }

    @Transactional
    public FulfillmentResponse updateShipment(UUID userId, UUID id, ShipmentRequest request) {
        Fulfillment f = findFulfillment(userId, id);
        if (f.getType() != FulfillmentType.MAIL) {
            f.setType(FulfillmentType.MAIL);
        }
        ShipmentPlan plan = ensureShipment(f);
        if (request.shipFromAddressId() != null) {
            plan.setShipFromAddressId(request.shipFromAddressId());
        }
        if (request.shipToAddressId() != null) {
            plan.setShipToAddressId(request.shipToAddressId());
        }
        if (request.carrier() != null) {
            plan.setCarrier(request.carrier());
        }
        if (request.trackingNumber() != null) {
            plan.setTrackingNumber(request.trackingNumber());
            f.setStatus(FulfillmentStatus.IN_TRANSIT);
        }
        if (request.shippedAt() != null) {
            plan.setShippedAt(request.shippedAt());
        }
        if (request.deliveredAt() != null) {
            plan.setDeliveredAt(request.deliveredAt());
            f.setStatus(FulfillmentStatus.COMPLETED);
        }
        if (f.getStatus() == FulfillmentStatus.DRAFT) {
            f.setStatus(FulfillmentStatus.PROPOSED);
        }
        shipmentPlanRepository.save(plan);
        fulfillmentRepository.save(f);
        return toResponse(f);
    }

    @Transactional
    public FulfillmentResponse patchStatus(UUID userId, UUID id, StatusPatchRequest request) {
        Fulfillment f = findFulfillment(userId, id);
        f.setStatus(request.status());
        fulfillmentRepository.save(f);
        return toResponse(f);
    }

    private Fulfillment findFulfillment(UUID userId, UUID id) {
        return fulfillmentRepository
                .findById(id)
                .filter(f -> loanPort.isParticipant(f.getLoanId(), userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fulfillment not found"));
    }

    private MeetupPlan ensureMeetup(Fulfillment f) {
        return meetupPlanRepository
                .findById(f.getId())
                .orElseGet(() -> {
                    MeetupPlan p = new MeetupPlan();
                    p.setFulfillment(f);
                    return meetupPlanRepository.save(p);
                });
    }

    private ShipmentPlan ensureShipment(Fulfillment f) {
        return shipmentPlanRepository
                .findById(f.getId())
                .orElseGet(() -> {
                    ShipmentPlan p = new ShipmentPlan();
                    p.setFulfillment(f);
                    return shipmentPlanRepository.save(p);
                });
    }

    private FulfillmentResponse toResponse(Fulfillment f) {
        FulfillmentResponse.MeetupResponse meetup = meetupPlanRepository
                .findById(f.getId())
                .map(m -> new FulfillmentResponse.MeetupResponse(
                        m.getProposedLocation(), m.getProposedAt(), m.getConfirmedAt(), m.getNotes()))
                .orElse(null);
        FulfillmentResponse.ShipmentResponse shipment = shipmentPlanRepository
                .findById(f.getId())
                .map(s -> new FulfillmentResponse.ShipmentResponse(
                        s.getShipFromAddressId(),
                        s.getShipToAddressId(),
                        s.getCarrier(),
                        s.getTrackingNumber(),
                        s.getShippedAt(),
                        s.getDeliveredAt()))
                .orElse(null);
        return new FulfillmentResponse(
                f.getId(), f.getLoanId(), f.getType(), f.getStatus(), f.getCreatedAt(), meetup, shipment);
    }
}
