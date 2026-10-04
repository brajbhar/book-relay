import type { Book } from '../types';

/** Reliable ISBN cover source (Open Library is often slow or unavailable). */
export function abeBooksCoverUrl(isbn: string): string {
  const normalized = isbn.replace(/[^0-9Xx]/g, '');
  return `https://pictures.abebooks.com/isbn/${normalized}-us.jpg`;
}

export function openLibraryCoverUrl(isbn: string, size: 'S' | 'M' | 'L' = 'M'): string {
  const normalized = isbn.replace(/[^0-9Xx]/g, '');
  return `https://covers.openlibrary.org/b/isbn/${normalized}-${size}.jpg`;
}

/** Ordered list of cover URLs to try for a book (most reliable first). */
export function bookCoverCandidates(book: Pick<Book, 'coverImageUrl' | 'isbn'>): string[] {
  const candidates: string[] = [];

  if (book.isbn?.trim()) {
    const isbn = book.isbn.trim();
    candidates.push(abeBooksCoverUrl(isbn));
  }

  if (book.coverImageUrl?.trim()) {
    candidates.push(book.coverImageUrl.trim());
  }

  if (book.isbn?.trim()) {
    const isbn = book.isbn.trim();
    candidates.push(openLibraryCoverUrl(isbn, 'M'));
    candidates.push(openLibraryCoverUrl(isbn, 'L'));
  }

  return [...new Set(candidates)];
}

export function primaryBookCoverUrl(book: Pick<Book, 'coverImageUrl' | 'isbn'>): string | null {
  const [first] = bookCoverCandidates(book);
  return first ?? null;
}
