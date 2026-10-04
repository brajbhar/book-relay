import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { booksApi, borrowsApi } from '../api/services';
import { BookCover } from '../components/BookCover';
import { useAuth } from '../context/AuthContext';

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.get(id!).then((r) => r.data),
    enabled: !!id,
  });

  const borrowMutation = useMutation({
    mutationFn: () => borrowsApi.createRequest({ bookId: id!, message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests-outgoing'] });
      navigate('/my/requests');
    },
  });

  const handleBorrow = (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    borrowMutation.mutate();
  };

  if (isLoading || !book) return <p>Loading…</p>;

  const isOwner = user?.id === book.ownerId;

  return (
    <div className="max-w-2xl rounded-xl bg-white p-8 shadow-sm">
      {(book.coverImageUrl || book.isbn) && (
        <div className="mb-6 overflow-hidden rounded-lg bg-slate-100">
          <BookCover
            book={book}
            className="mx-auto flex max-w-xs items-center justify-center p-4"
            imageClassName="max-h-96 w-full object-contain shadow-md"
          />
        </div>
      )}
      <h1 className="text-3xl font-bold">{book.title}</h1>
      {book.author && <p className="text-lg text-slate-600">{book.author}</p>}
      <p className="mt-2 text-sm text-slate-500">
        Listed by {book.ownerDisplayName} · {book.condition} · {book.status}
      </p>
      {book.description && <p className="mt-4 text-slate-700">{book.description}</p>}
      {book.status === 'AVAILABLE' && !isOwner && (
        <form onSubmit={handleBorrow} className="mt-6 space-y-3">
          <textarea
            placeholder="Message to the lender (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            rows={3}
          />
          <button
            type="submit"
            disabled={borrowMutation.isPending}
            className="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-800"
          >
            {token ? 'Request to borrow' : 'Sign in to borrow'}
          </button>
          {borrowMutation.isError && (
            <p className="text-sm text-red-600">Could not submit request.</p>
          )}
        </form>
      )}
      {isOwner && (
        <Link to="/my/listings" className="mt-4 inline-block text-brand-600 hover:underline">
          Manage in My Listings
        </Link>
      )}
    </div>
  );
}
