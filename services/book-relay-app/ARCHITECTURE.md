# Book Relay backend — modular monolith

Single Spring Boot app (`book-relay-app`) on port **8080**. Domain logic is split into packages so you can extract microservices later if needed.

## Package layout

| Package | Responsibility | SQL schema |
|---------|----------------|------------|
| `com.bookrelay.auth` | Register/login, JWT, profile, addresses | `auth` |
| `com.bookrelay.catalog` | Book listings, browse, status | `catalog` |
| `com.bookrelay.lending` | Borrow requests, loans, return | `lending` |
| `com.bookrelay.fulfillment` | Meetup / mail handoff | `fulfillment` |
| `com.bookrelay.integration.*` | **Ports** between modules (in-process today) | — |
| `com.bookrelay.config` / `security` | JWT filter, CORS, schema bootstrap | — |

## Rules for a future split

1. **No cross-module JPA** — use UUID references only (e.g. `bookId`, `ownerId`).
2. **Cross-module calls go through ports** in `integration`:
   - `AuthUserPort` — catalog reads owner display name / postal code
   - `CatalogPort` — lending updates book status
   - `FulfillmentPort` — lending creates fulfillment draft
   - `LoanPort` — fulfillment checks the caller is the loan's borrower or lender
3. **Keep SQL schemas separate** — entities use `@Table(..., schema = "…")`.
4. **Keep REST paths stable** — `/api/auth/**`, `/api/books/**`, `/api/borrows/**`, `/api/fulfillment/**`.

To extract a module later: move its package to a new Spring Boot app, replace the corresponding `*PortAdapter` with an HTTP client, and optionally add an API gateway.

## Run

```bash
cd services/book-relay-app && mvn spring-boot:run
```

Requires SQL Server with database `book_relay` (see repo root `docker compose up -d sqlserver db-init`).
