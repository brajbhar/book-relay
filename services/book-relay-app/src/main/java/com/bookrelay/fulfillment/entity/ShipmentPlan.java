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
@Table(name = "shipment_plans", schema = "fulfillment")
public class ShipmentPlan {

    @Id
    private UUID fulfillmentId;

    @OneToOne
    @MapsId
    @jakarta.persistence.JoinColumn(name = "fulfillment_id")
    private Fulfillment fulfillment;

    @Column(name = "ship_from_address_id")
    private UUID shipFromAddressId;

    @Column(name = "ship_to_address_id")
    private UUID shipToAddressId;

    private String carrier;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "shipped_at")
    private Instant shippedAt;

    @Column(name = "delivered_at")
    private Instant deliveredAt;

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

    public UUID getShipFromAddressId() {
        return shipFromAddressId;
    }

    public void setShipFromAddressId(UUID shipFromAddressId) {
        this.shipFromAddressId = shipFromAddressId;
    }

    public UUID getShipToAddressId() {
        return shipToAddressId;
    }

    public void setShipToAddressId(UUID shipToAddressId) {
        this.shipToAddressId = shipToAddressId;
    }

    public String getCarrier() {
        return carrier;
    }

    public void setCarrier(String carrier) {
        this.carrier = carrier;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public Instant getShippedAt() {
        return shippedAt;
    }

    public void setShippedAt(Instant shippedAt) {
        this.shippedAt = shippedAt;
    }

    public Instant getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(Instant deliveredAt) {
        this.deliveredAt = deliveredAt;
    }
}
