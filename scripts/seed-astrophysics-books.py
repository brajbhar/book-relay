#!/usr/bin/env python3
"""Seed 10 astrophysics books via the Book Relay API.

Requires api-gateway (8080), auth-service (8081), and catalog-service (8082).

Usage:
  python scripts/seed-astrophysics-books.py
  API_URL=http://localhost:8080 SEED_EMAIL=astro@test.com python scripts/seed-astrophysics-books.py

If books already exist for the seed user, matching titles are updated with cover URLs
instead of creating duplicates.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

API_URL = os.environ.get("API_URL", "http://localhost:8080").rstrip("/")
SEED_EMAIL = os.environ.get("SEED_EMAIL", "astro-lender@test.com")
SEED_PASSWORD = os.environ.get("SEED_PASSWORD", "password123")
SEED_NAME = os.environ.get("SEED_NAME", "Astro Lender")


def open_library_cover(isbn: str) -> str:
    return f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"


def abe_books_cover(isbn: str) -> str:
    return f"https://pictures.abebooks.com/isbn/{isbn}-us.jpg"


ASTRO_BOOKS = [
    {
        "title": "A Brief History of Time",
        "author": "Stephen Hawking",
        "isbn": "9780553380163",
        "description": "From the Big Bang to black holes — a classic introduction to cosmology.",
        "condition": "GOOD",
    },
    {
        "title": "Astrophysics for People in a Hurry",
        "author": "Neil deGrasse Tyson",
        "isbn": "9780393609394",
        "description": "Concise essays on the universe, dark matter, and the cosmic perspective.",
        "condition": "LIKE_NEW",
    },
    {
        "title": "Cosmos",
        "author": "Carl Sagan",
        "isbn": "9780345539434",
        "description": "Exploration of the universe and humanity's place in it.",
        "condition": "GOOD",
    },
    {
        "title": "The Fabric of the Cosmos",
        "author": "Brian Greene",
        "isbn": "9780375727207",
        "description": "Space, time, and the texture of reality explained for general readers.",
        "condition": "GOOD",
    },
    {
        "title": "Black Holes and Time Warps",
        "author": "Kip Thorne",
        "isbn": "9780393312768",
        "description": "Einstein's outrageous legacy and the science of spacetime.",
        "condition": "FAIR",
    },
    {
        "title": "The First Three Minutes",
        "author": "Steven Weinberg",
        "isbn": "9780465024377",
        "description": "A modern classic on the early universe after the Big Bang.",
        "condition": "GOOD",
    },
    {
        "title": "Death by Black Hole",
        "author": "Neil deGrasse Tyson",
        "isbn": "9780393330168",
        "description": "Essays on astrophysics, cosmic phenomena, and scientific curiosity.",
        "condition": "GOOD",
    },
    {
        "title": "The Planet Factory",
        "author": "Elizabeth Tasker",
        "isbn": "9781472910203",
        "description": "Exoplanets and the science of how worlds form around other stars.",
        "condition": "LIKE_NEW",
    },
    {
        "title": "An Introduction to Modern Astrophysics",
        "author": "Bradley Carroll and Dale Ostlie",
        "isbn": "9781108422161",
        "description": "Comprehensive textbook covering stars, galaxies, and cosmology.",
        "condition": "GOOD",
    },
    {
        "title": "The Hidden Reality",
        "author": "Brian Greene",
        "isbn": "9780307265630",
        "description": "Parallel universes and the deep laws of the cosmos.",
        "condition": "NEW",
    },
]


def book_payload(book: dict) -> dict:
    return {
        **book,
        "coverImageUrl": book.get("coverImageUrl") or abe_books_cover(book["isbn"]),
    }


def api_request(
    method: str,
    path: str,
    payload: dict | None = None,
    token: str | None = None,
) -> tuple[int, dict | str | list]:
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(f"{API_URL}{path}", data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode()
            if not body:
                return resp.status, {}
            parsed = json.loads(body)
            return resp.status, parsed
    except urllib.error.HTTPError as err:
        body = err.read().decode()
        try:
            parsed = json.loads(body) if body else {}
        except json.JSONDecodeError:
            parsed = body
        return err.code, parsed


def api_post(path: str, payload: dict, token: str | None = None) -> tuple[int, dict | str | list]:
    return api_request("POST", path, payload, token)


def api_get(path: str, token: str) -> tuple[int, dict | str | list]:
    return api_request("GET", path, token=token)


def api_put(path: str, payload: dict, token: str) -> tuple[int, dict | str | list]:
    return api_request("PUT", path, payload, token)


def ensure_user() -> str:
    status, body = api_post(
        "/api/auth/register",
        {"email": SEED_EMAIL, "password": SEED_PASSWORD, "displayName": SEED_NAME},
    )
    if status in (200, 201):
        print(f"Registered seed user: {SEED_EMAIL}", file=sys.stderr)
    elif status == 409:
        print(f"Seed user already exists: {SEED_EMAIL}", file=sys.stderr)
    else:
        raise RuntimeError(f"Register failed (HTTP {status}): {body}")

    status, body = api_post(
        "/api/auth/login",
        {"email": SEED_EMAIL, "password": SEED_PASSWORD},
    )
    if status != 200 or not isinstance(body, dict) or "accessToken" not in body:
        raise RuntimeError(f"Login failed (HTTP {status}): {body}")
    return body["accessToken"]


def ensure_address(token: str) -> None:
    status, body = api_post(
        "/api/auth/addresses",
        {
            "label": "Home",
            "line1": "123 Observatory Lane",
            "city": "Pasadena",
            "state": "CA",
            "postalCode": "91101",
            "country": "US",
            "isDefault": True,
        },
        token,
    )
    if status in (200, 201):
        print("Added default address for seed user.", file=sys.stderr)
    elif status in (400, 409):
        print("Address may already exist; continuing.", file=sys.stderr)
    else:
        raise RuntimeError(f"Address setup failed (HTTP {status}): {body}")


def main() -> int:
    print(f"Using API: {API_URL}", file=sys.stderr)
    print(f"Seed user: {SEED_EMAIL}", file=sys.stderr)

    token = ensure_user()
    ensure_address(token)

    status, existing = api_get("/api/books/mine", token)
    if status != 200 or not isinstance(existing, list):
        raise RuntimeError(f"Could not load existing listings (HTTP {status}): {existing}")

    by_title = {book["title"]: book for book in existing if isinstance(book, dict) and "title" in book}

    created = 0
    updated = 0
    for book in ASTRO_BOOKS:
        payload = book_payload(book)
        existing_book = by_title.get(book["title"])
        if existing_book:
            status, body = api_put(f"/api/books/{existing_book['id']}", payload, token)
            if status != 200 or not isinstance(body, dict):
                print(f"FAILED update '{book['title']}' (HTTP {status}): {body}", file=sys.stderr)
                return 1
            print(f"Updated cover: {body.get('title', book['title'])}")
            updated += 1
            continue

        status, body = api_post("/api/books", payload, token)
        if status not in (200, 201) or not isinstance(body, dict):
            print(f"FAILED create '{book['title']}' (HTTP {status}): {body}", file=sys.stderr)
            return 1
        print(f"Added: {body.get('title', book['title'])}")
        created += 1

    print(
        f"Done. Created {created}, updated {updated} astrophysics books for {SEED_EMAIL}.",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except urllib.error.URLError as err:
        print(f"Could not reach API at {API_URL}: {err}", file=sys.stderr)
        print("Start api-gateway, auth-service, and catalog-service first.", file=sys.stderr)
        raise SystemExit(1)
