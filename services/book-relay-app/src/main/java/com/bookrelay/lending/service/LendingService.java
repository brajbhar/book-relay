package com.bookrelay.lending.service;

import com.bookrelay.catalog.entity.BookStatus;
import com.bookrelay.integration.catalog.CatalogPort;
import com.bookrelay.integration.fulfillment.FulfillmentPort;
import com.bookrelay.lending.dto.BorrowRequestResponse;
import com.bookrelay.lending.dto.CreateBorrowRequest;
import com.bookrelay.lending.dto.LoanResponse;
import com.bookrelay.lending.entity.BorrowRequest;
import com.bookrelay.lending.entity.BorrowRequestStatus;
import com.bookrelay.lending.entity.Loan;
import com.bookrelay.lending.entity.LoanStatus;
import com.bookrelay.lending.repository.BorrowRequestRepository;
import com.bookrelay.lending.repository.LoanRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LendingService {

    private final BorrowRequestRepository borrowRequestRepository;
    private final LoanRepository loanRepository;
    private final CatalogPort catalogPort;
    private final FulfillmentPort fulfillmentPort;

    public LendingService(
            BorrowRequestRepository borrowRequestRepository,
            LoanRepository loanRepository,
            CatalogPort catalogPort,
            FulfillmentPort fulfillmentPort) {
        this.borrowRequestRepository = borrowRequestRepository;
        this.loanRepository = loanRepository;
        this.catalogPort = catalogPort;
        this.fulfillmentPort = fulfillmentPort;
    }

    @Transactional
    public BorrowRequestResponse createRequest(UUID borrowerId, CreateBorrowRequest request) {
        CatalogPort.BookInfo book = catalogPort.getBook(request.bookId());
        if (book.status() != BookStatus.AVAILABLE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Book is not available");
        }
        if (book.ownerId().equals(borrowerId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot borrow your own book");
        }
        if (borrowRequestRepository.existsByBookIdAndBorrowerIdAndStatus(
                request.bookId(), borrowerId, BorrowRequestStatus.PENDING)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Pending request already exists");
        }
        BorrowRequest br = new BorrowRequest();
        br.setBookId(request.bookId());
        br.setBorrowerId(borrowerId);
        br.setLenderId(book.ownerId());
        br.setMessage(request.message());
        return toBorrowResponse(borrowRequestRepository.save(br));
    }

    public List<BorrowRequestResponse> incoming(UUID lenderId) {
        return borrowRequestRepository.findByLenderId(lenderId).stream()
                .map(this::toBorrowResponse)
                .toList();
    }

    public List<BorrowRequestResponse> outgoing(UUID borrowerId) {
        return borrowRequestRepository.findByBorrowerId(borrowerId).stream()
                .map(this::toBorrowResponse)
                .toList();
    }

    @Transactional
    public LoanResponse approve(UUID lenderId, UUID requestId) {
        BorrowRequest br = borrowRequestRepository
                .findByIdAndLenderId(requestId, lenderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        if (br.getStatus() != BorrowRequestStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Request is not pending");
        }
        catalogPort.updateBookStatus(br.getBookId(), BookStatus.BORROWED);
        br.setStatus(BorrowRequestStatus.APPROVED);
        borrowRequestRepository.save(br);

        Loan loan = new Loan();
        loan.setBorrowRequestId(br.getId());
        loan.setBookId(br.getBookId());
        loan.setBorrowerId(br.getBorrowerId());
        loan.setLenderId(br.getLenderId());
        loan.setDueAt(Instant.now().plus(30, ChronoUnit.DAYS));
        loan = loanRepository.save(loan);

        try {
            fulfillmentPort.createDraft(loan.getId());
        } catch (Exception ignored) {
            // fulfillment draft is best-effort
        }
        return toLoanResponse(loan);
    }

    @Transactional
    public BorrowRequestResponse reject(UUID lenderId, UUID requestId) {
        BorrowRequest br = findLenderRequest(lenderId, requestId);
        if (br.getStatus() != BorrowRequestStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Request is not pending");
        }
        br.setStatus(BorrowRequestStatus.REJECTED);
        return toBorrowResponse(borrowRequestRepository.save(br));
    }

    @Transactional
    public BorrowRequestResponse cancel(UUID borrowerId, UUID requestId) {
        BorrowRequest br = borrowRequestRepository
                .findByIdAndBorrowerId(requestId, borrowerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        if (br.getStatus() != BorrowRequestStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Request is not pending");
        }
        br.setStatus(BorrowRequestStatus.CANCELLED);
        return toBorrowResponse(borrowRequestRepository.save(br));
    }

    public List<LoanResponse> myLoans(UUID userId) {
        return loanRepository.findByBorrowerIdOrLenderId(userId, userId).stream()
                .map(this::toLoanResponse)
                .toList();
    }

    @Transactional
    public LoanResponse returnLoan(UUID userId, UUID loanId) {
        Loan loan = loanRepository
                .findById(loanId)
                .filter(l -> l.getBorrowerId().equals(userId) || l.getLenderId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loan not found"));
        if (loan.getStatus() != LoanStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Loan is not active");
        }
        catalogPort.updateBookStatus(loan.getBookId(), BookStatus.AVAILABLE);
        loan.setStatus(LoanStatus.RETURNED);
        loan.setReturnedAt(Instant.now());
        return toLoanResponse(loanRepository.save(loan));
    }

    private BorrowRequest findLenderRequest(UUID lenderId, UUID requestId) {
        return borrowRequestRepository
                .findByIdAndLenderId(requestId, lenderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
    }

    private BorrowRequestResponse toBorrowResponse(BorrowRequest br) {
        return new BorrowRequestResponse(
                br.getId(),
                br.getBookId(),
                br.getBorrowerId(),
                br.getLenderId(),
                br.getMessage(),
                br.getStatus(),
                br.getCreatedAt());
    }

    private LoanResponse toLoanResponse(Loan loan) {
        return new LoanResponse(
                loan.getId(),
                loan.getBorrowRequestId(),
                loan.getBookId(),
                loan.getBorrowerId(),
                loan.getLenderId(),
                loan.getStatus(),
                loan.getBorrowedAt(),
                loan.getDueAt(),
                loan.getReturnedAt());
    }
}
