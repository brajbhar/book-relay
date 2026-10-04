package com.bookrelay.fulfillment.repository;

import com.bookrelay.fulfillment.entity.MeetupPlan;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetupPlanRepository extends JpaRepository<MeetupPlan, UUID> {}
