import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { borrowsApi } from '../api/services';

export function RequestsPage() {
  const queryClient = useQueryClient();
  const { data: requests = [] } = useQuery({
    queryKey: ['requests-outgoing'],
    queryFn: () => borrowsApi.outgoing().then((r) => r.data),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => borrowsApi.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['requests-outgoing'] }),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My borrow requests</h1>
      <ul className="space-y-3">
        {requests.map((req) => (
          <li key={req.id} className="rounded-lg border bg-white p-4">
            <Link to={`/books/${req.bookId}`} className="font-medium text-brand-600">
              Book {req.bookId.slice(0, 8)}…
            </Link>
            <p className="text-sm text-slate-500">Status: {req.status}</p>
            {req.message && <p className="mt-1 text-sm">{req.message}</p>}
            {req.status === 'PENDING' && (
              <button
                type="button"
                onClick={() => cancelMutation.mutate(req.id)}
                className="mt-2 text-sm text-red-600"
              >
                Cancel
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
