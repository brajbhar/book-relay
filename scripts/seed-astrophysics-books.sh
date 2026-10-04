#!/usr/bin/env bash
# Wrapper for seed-astrophysics-books.py (works on Windows Git Bash too).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec python "$ROOT/scripts/seed-astrophysics-books.py" "$@"
