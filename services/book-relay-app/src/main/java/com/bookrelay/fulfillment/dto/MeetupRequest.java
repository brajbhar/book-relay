package com.bookrelay.fulfillment.dto;

import java.time.Instant;

public record MeetupRequest(String proposedLocation, Instant proposedAt, Instant confirmedAt, String notes) {}
