#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "Building book-relay-app..."
(cd "$ROOT/services/book-relay-app" && mvn -q package -DskipTests)
echo "Backend built."
