#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Building and starting Book Relay (SQL Server + backend + frontend)..."
docker compose up --build -d

echo ""
echo "Waiting for services (first run may take 1–2 minutes)..."
sleep 5

if curl -sf http://localhost:8080/api/books -o /dev/null 2>/dev/null; then
  echo "API is responding."
else
  echo "API not ready yet — check: docker compose logs -f backend"
fi

echo ""
echo "Book Relay:"
echo "  Frontend:   http://localhost:5173"
echo "  API:        http://localhost:8080"
echo "  SQL Server: localhost:1433"
echo ""
echo "View logs: docker compose logs -f"
echo "Stop all:  docker compose down"
