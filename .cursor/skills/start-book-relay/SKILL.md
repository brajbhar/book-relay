---
name: start-book-relay
description: >-
  Starts Book Relay local dev stack (SQL Server, backend monolith, frontend).
  Use when the user asks to run the app locally or start backend/frontend.
---

# Start Book Relay (local development)

Run from the **repository root** (`book-relay/`).

## SQL Server

```bash
docker compose up -d sqlserver db-init
```

## Backend (port 8080)

```bash
cd services/book-relay-app && mvn spring-boot:run
```

## Frontend (port 5173)

In another terminal:

```bash
cd frontend && npm install && npm run dev
```

Ensure `frontend/.env` has `VITE_API_URL=http://localhost:8080` (see `.env.example`).

## Docker full stack

```bash
docker compose up --build -d
```

## Prerequisites

- Docker Desktop (SQL Server)
- Java 21+, Maven 3.9+
- Node.js 20+ (frontend)
