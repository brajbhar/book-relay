package com.bookrelay.lending.controller;

import com.bookrelay.lending.dto.BorrowRequestResponse;
import com.bookrelay.lending.dto.CreateBorrowRequest;
import com.bookrelay.lending.dto.LoanResponse;
import com.bookrelay.lending.service.LendingService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/borrows")
public class BorrowController {

    private final LendingService lendingService;

    public BorrowController(LendingService lendingService) {
        this.lendingService = lendingService;
    }

    @PostMapping("/requests")
    public BorrowRequestResponse create(Authentication auth, @Valid @RequestBody CreateBorrowRequest request) {
        return lendingService.createRequest(userId(auth), request);
    }

    @GetMapping("/requests/incoming")
    public List<BorrowRequestResponse> incoming(Authentication auth) {
        return lendingService.incoming(userId(auth));
    }

    @GetMapping("/requests/outgoing")
    public List<BorrowRequestResponse> outgoing(Authentication auth) {
        return lendingService.outgoing(userId(auth));
    }

    @PostMapping("/requests/{id}/approve")
    public LoanResponse approve(Authentication auth, @PathVariable UUID id) {
        return lendingService.approve(userId(auth), id);
    }

    @PostMapping("/requests/{id}/reject")
    public BorrowRequestResponse reject(Authentication auth, @PathVariable UUID id) {
        return lendingService.reject(userId(auth), id);
    }

    @PostMapping("/requests/{id}/cancel")
    public BorrowRequestResponse cancel(Authentication auth, @PathVariable UUID id) {
        return lendingService.cancel(userId(auth), id);
    }

    @GetMapping("/loans")
    public List<LoanResponse> loans(Authentication auth) {
        return lendingService.myLoans(userId(auth));
    }

    @PostMapping("/loans/{id}/return")
    public LoanResponse returnLoan(Authentication auth, @PathVariable UUID id) {
        return lendingService.returnLoan(userId(auth), id);
    }

    private UUID userId(Authentication authentication) {
        return (UUID) authentication.getPrincipal();
    }
}
