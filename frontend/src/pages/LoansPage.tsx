import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { borrowsApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

export function LoansPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: loans = [] } = useQuery({
    queryKey: ['loans'],
    queryFn: () => borrowsApi.loans().then((r) => r.data),
  });

  const returnMutation = useMutation({
    mutationFn: (id: string) => borrowsApi.returnLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My loans</h1>
      <ul className="space-y-3">
        {loans.map((loan) => (
          <li key={loan.id} className="rounded-lg border bg-white p-4">
            <p className="font-medium">
              Book {loan.bookId.slice(0, 8)}… · {loan.status}
            </p>
            <p className="text-sm text-slate-500">
              {loan.borrowerId === user?.id ? 'You are borrowing' : 'You are lending'} · Due{' '}
              {new Date(loan.dueAt).toLocaleDateString()}
            </p>
            {loan.status === 'ACTIVE' && (
              <div className="mt-3 flex gap-2">
                <Link
                  to={`/my/loans/${loan.id}/fulfillment`}
                  className="rounded-lg bg-brand-600 px-3 py-1 text-sm text-white"
                >
                  Fulfillment
                </Link>
                <button
                  type="button"
                  onClick={() => returnMutation.mutate(loan.id)}
                  className="rounded-lg border px-3 py-1 text-sm"
                >
                  Mark returned
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
