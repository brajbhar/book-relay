import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { borrowsApi } from '../api/services';

export function InboxPage() {
  const queryClient = useQueryClient();
  const { data: requests = [] } = useQuery({
    queryKey: ['requests-incoming'],
    queryFn: () => borrowsApi.incoming().then((r) => r.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => borrowsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests-incoming'] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => borrowsApi.reject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['requests-incoming'] }),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Incoming borrow requests</h1>
      <ul className="space-y-3">
        {requests
          .filter((r) => r.status === 'PENDING')
          .map((req) => (
            <li key={req.id} className="rounded-lg border bg-white p-4">
              <Link to={`/books/${req.bookId}`} className="font-medium text-brand-600">
                View book
              </Link>
              {req.message && <p className="mt-1 text-sm">{req.message}</p>}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => approveMutation.mutate(req.id)}
                  className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => rejectMutation.mutate(req.id)}
                  className="rounded-lg bg-slate-200 px-3 py-1 text-sm"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
