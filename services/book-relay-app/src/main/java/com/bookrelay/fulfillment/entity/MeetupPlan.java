package com.bookrelay.fulfillment.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "meetup_plans", schema = "fulfillment")
public class MeetupPlan {

    @Id
    private UUID fulfillmentId;

    @OneToOne
    @MapsId
    @jakarta.persistence.JoinColumn(name = "fulfillment_id")
    private Fulfillment fulfillment;

    @Column(name = "proposed_location")
    private String proposedLocation;

    @Column(name = "proposed_at")
    private Instant proposedAt;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    private String notes;

    public UUID getFulfillmentId() {
        return fulfillmentId;
    }

    public void setFulfillmentId(UUID fulfillmentId) {
        this.fulfillmentId = fulfillmentId;
    }

    public Fulfillment getFulfillment() {
        return fulfillment;
    }

    public void setFulfillment(Fulfillment fulfillment) {
        this.fulfillment = fulfillment;
    }

    public String getProposedLocation() {
        return proposedLocation;
    }

    public void setProposedLocation(String proposedLocation) {
        this.proposedLocation = proposedLocation;
    }

    public Instant getProposedAt() {
        return proposedAt;
    }

    public void setProposedAt(Instant proposedAt) {
        this.proposedAt = proposedAt;
    }

    public Instant getConfirmedAt() {
        return confirmedAt;
    }

    public void setConfirmedAt(Instant confirmedAt) {
        this.confirmedAt = confirmedAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
