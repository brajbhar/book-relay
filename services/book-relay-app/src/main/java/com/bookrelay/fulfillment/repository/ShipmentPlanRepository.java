package com.bookrelay.fulfillment.repository;

import com.bookrelay.fulfillment.entity.ShipmentPlan;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentPlanRepository extends JpaRepository<ShipmentPlan, UUID> {}
