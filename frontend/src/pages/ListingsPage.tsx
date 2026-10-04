import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi, booksApi } from '../api/services';
import type { Book } from '../types';
import { emptyBookForm, getApiErrorMessage, toBookPayload } from '../utils/bookForm';

export function ListingsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyBookForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['my-books'],
    queryFn: () => booksApi.mine().then((r) => r.data),
  });

  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => authApi.addresses().then((r) => r.data),
  });

  const hasAddress = addresses.some((a) => a.isDefault) || addresses.length > 0;

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = toBookPayload(form);
      return editingId
        ? booksApi.update(editingId, payload).then((r) => r.data)
        : booksApi.create(payload).then((r) => r.data);
    },
    onSuccess: (book) => {
      queryClient.invalidateQueries({ queryKey: ['my-books'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setForm(emptyBookForm);
      setEditingId(null);
      setSuccessMessage(
        editingId ? `"${book.title}" updated.` : `"${book.title}" added to the catalog.`
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => booksApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-books'] }),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    saveMutation.mutate();
  };

  const startEdit = (book: Book) => {
    setEditingId(book.id);
    setSuccessMessage(null);
    setForm({
      title: book.title,
      author: book.author || '',
      isbn: book.isbn || '',
      description: book.description || '',
      condition: book.condition,
      coverImageUrl: book.coverImageUrl || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyBookForm);
    setSuccessMessage(null);
    saveMutation.reset();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <p className="mt-1 text-slate-600">
          Add books to the catalog so other readers can request to borrow them.
        </p>
      </div>

      {!hasAddress && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Add a default address on your{' '}
          <Link to="/profile" className="font-medium underline">
            profile
          </Link>{' '}
          before listing a book. Your postal code helps nearby borrowers find your books.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">{editingId ? 'Edit listing' : 'Add a book'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                required
                placeholder="The Great Gatsby"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="author" className="mb-1 block text-sm font-medium text-slate-700">
                Author
              </label>
              <input
                id="author"
                placeholder="F. Scott Fitzgerald"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="isbn" className="mb-1 block text-sm font-medium text-slate-700">
                ISBN
              </label>
              <input
                id="isbn"
                placeholder="978-0-7432-7356-5"
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Brief notes about the book's condition or edition"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border px-3 py-2"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="condition" className="mb-1 block text-sm font-medium text-slate-700">
                Condition
              </label>
              <select
                id="condition"
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full rounded-lg border px-3 py-2"
              >
                {['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'].map((c) => (
                  <option key={c} value={c}>
                    {c.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="coverImageUrl" className="mb-1 block text-sm font-medium text-slate-700">
                Cover image URL
              </label>
              <input
                id="coverImageUrl"
                type="url"
                placeholder="https://example.com/cover.jpg"
                value={form.coverImageUrl}
                onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            {saveMutation.isError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {getApiErrorMessage(saveMutation.error, 'Could not save listing. Please try again.')}
              </p>
            )}
            {successMessage && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={saveMutation.isPending || (!editingId && !hasAddress)}
                className="rounded-lg bg-brand-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saveMutation.isPending ? 'Saving…' : editingId ? 'Update' : 'List book'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="text-sm text-slate-500">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold">Your listings</h2>
          {isLoading ? (
            <p className="text-slate-500">Loading your books…</p>
          ) : books.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
              No listings yet. Use the form to add your first book.
            </p>
          ) : (
            <ul className="space-y-3">
              {books.map((book) => (
                <li key={book.id} className="rounded-lg border bg-white p-4">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <Link to={`/books/${book.id}`} className="font-semibold hover:text-brand-600">
                        {book.title}
                      </Link>
                      {book.author && <p className="text-sm text-slate-600">{book.author}</p>}
                      <p className="text-sm text-slate-500">{book.status}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(book)}
                        className="text-sm text-brand-600"
                      >
                        Edit
                      </button>
                      {book.status !== 'UNLISTED' && (
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(book.id)}
                          disabled={deleteMutation.isPending}
                          className="text-sm text-red-600 disabled:opacity-50"
                        >
                          Unlist
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
