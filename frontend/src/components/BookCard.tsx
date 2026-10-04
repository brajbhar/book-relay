import { Link } from 'react-router-dom';
import type { Book } from '../types';
import { BookCover } from './BookCover';

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-500 hover:shadow-md"
    >
      <div className="mb-3 overflow-hidden rounded-lg bg-slate-100">
        <BookCover book={book} />
      </div>
      <h3 className="font-semibold text-slate-900">{book.title}</h3>
      {book.author && <p className="text-sm text-slate-500">{book.author}</p>}
      <p className="mt-2 text-xs text-slate-400">
        {book.ownerDisplayName} · {book.ownerPostalCode || '—'} · {book.condition}
      </p>
      <span
        className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
          book.status === 'AVAILABLE'
            ? 'bg-green-100 text-green-800'
            : 'bg-amber-100 text-amber-800'
        }`}
      >
        {book.status}
      </span>
    </Link>
  );
}
