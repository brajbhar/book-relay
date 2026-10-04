import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { booksApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

export function BrowsePage() {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books', title, author, postalCode],
    queryFn: () =>
      booksApi
        .browse({
          title: title || undefined,
          author: author || undefined,
          postalCode: postalCode || undefined,
        })
        .then((r) => r.data),
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Browse books to borrow</h1>
          <p className="text-slate-600">Discover physical books shared by readers near you.</p>
        </div>
        {token ? (
          <Link
            to="/my/listings"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            List a book
          </Link>
        ) : (
          <Link
            to="/register"
            className="rounded-lg border border-brand-600 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
          >
            Sign up to share books
          </Link>
        )}
      </div>
      <div className="mb-6 grid gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-3">
        <input
          placeholder="Search title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
        <input
          placeholder="Search author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
        <input
          placeholder="Owner postal code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>
      {isLoading ? (
        <p>Loading…</p>
      ) : books.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-500">No available books found.</p>
          {token && (
            <Link to="/my/listings" className="mt-3 inline-block text-sm font-medium text-brand-600">
              Be the first to list a book →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
