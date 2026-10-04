# Book Relay

Platform for borrowing physical books between registered users. List books you own, request borrows, approve loans, and coordinate **in-person meetup** or **mailing** for handoff.

## Repository layout

```
book-relay/
├── frontend/                 # React + Vite (UI)
├── services/
│   └── book-relay-app/       # Spring Boot modular monolith (API)
├── docker-compose.yml        # SQL Server + backend + frontend (optional)
└── scripts/
```

## Architecture

| Component | Port | Notes |
|-----------|------|--------|
| React UI (Vite) | 5173 | Talks to API at :8080 |
| **book-relay-app** | **8080** | Auth, catalog, lending, fulfillment (one JVM) |
| SQL Server | 1433 | Database `book_relay`, schemas `auth`, `catalog`, `lending`, `fulfillment` |

Module boundaries inside the backend are documented in [services/book-relay-app/ARCHITECTURE.md](services/book-relay-app/ARCHITECTURE.md).

## Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 20+
- Docker (for SQL Server)

## Quick start

### Option A — Docker (full stack)

Runs SQL Server, backend, and frontend:

```bash
docker compose up --build -d
```

Or:

```bash
bash scripts/docker-up.sh
```

| URL | Service |
|-----|---------|
| http://localhost:5173 | Frontend |
| http://localhost:8080 | API |
| localhost:1433 | SQL Server |

Stop: `docker compose down`

### Option B — Local development

**1. SQL Server**

```bash
docker compose up -d sqlserver db-init
```

**2. Backend**

```bash
cd services/book-relay-app
mvn spring-boot:run
```

**3. Frontend** (separate terminal)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

## Environment variables

| Variable | Default | Used by |
|----------|---------|---------|
| `DB_HOST` | `localhost` | backend |
| `DB_PORT` | `1433` | backend |
| `DB_NAME` | `book_relay` | backend |
| `DB_USER` | `sa` | backend |
| `DB_PASSWORD` | `BookRelay@12345` | backend |
| `JWT_SECRET` | dev secret (32+ chars) | backend |
| `JWT_EXPIRATION_MS` | `86400000` | backend |
| `SERVER_PORT` | `8080` | backend |
| `VITE_API_URL` | `http://localhost:8080` | frontend |

## E2E test flow (manual)

1. Register two users (e.g. lender@test.com, borrower@test.com).
2. As lender: Profile → add address with postal code (and lat/lng optional).
3. As lender: My Listings → list a book.
4. As borrower: Browse → open book → Request to borrow.
5. As lender: Inbox → Approve (creates loan, marks book BORROWED).
6. Either user: Loans → Fulfillment → choose meetup or mail, save details.
7. Either user: Loans → Mark returned (book becomes AVAILABLE again).

## API overview (`http://localhost:8080`)

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/books`, `GET /api/books/{id}`, `POST /api/books`, `GET /api/books/mine`
- `POST /api/borrows/requests`, `POST /api/borrows/requests/{id}/approve`
- `GET /api/fulfillment/loan/{loanId}`, `POST /api/fulfillment`

Protected routes require: `Authorization: Bearer <token>`.

## Production notes

- Replace Hibernate `ddl-auto: update` with Flyway/Liquibase per schema.
- Change `JWT_SECRET` and `DB_PASSWORD`; do not commit secrets.
