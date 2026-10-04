import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authApi, fulfillmentApi } from '../api/services';
import { MEETUP_THRESHOLD_KM } from '../utils/geo';

export function FulfillmentPage() {
  const { id: loanId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [type, setType] = useState<'MEETUP' | 'MAIL'>('MEETUP');
  const [location, setLocation] = useState('');
  const [proposedAt, setProposedAt] = useState('');
  const [notes, setNotes] = useState('');
  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');
  const [suggestMeetup, setSuggestMeetup] = useState<boolean | null>(null);

  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => authApi.addresses().then((r) => r.data),
  });

  const { data: fulfillment, isLoading } = useQuery({
    queryKey: ['fulfillment', loanId],
    queryFn: () => fulfillmentApi.getByLoan(loanId!).then((r) => r.data),
    enabled: !!loanId,
    retry: false,
  });

  useEffect(() => {
    const mine = addresses.find((a) => a.isDefault) || addresses[0];
    if (!mine?.latitude || !mine?.longitude) {
      setSuggestMeetup(false);
      return;
    }
    setSuggestMeetup(!!(mine.latitude && mine.longitude));
    setType('MEETUP');
  }, [addresses]);

  const createMutation = useMutation({
    mutationFn: () => fulfillmentApi.create({ loanId: loanId!, type }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fulfillment', loanId] }),
  });

  const meetupMutation = useMutation({
    mutationFn: (fulfillmentId: string) =>
      fulfillmentApi.updateMeetup(fulfillmentId, {
        proposedLocation: location,
        proposedAt: proposedAt ? new Date(proposedAt).toISOString() : undefined,
        notes,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fulfillment', loanId] }),
  });

  const shipmentMutation = useMutation({
    mutationFn: (fulfillmentId: string) =>
      fulfillmentApi.updateShipment(fulfillmentId, { carrier, trackingNumber: tracking }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fulfillment', loanId] }),
  });

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!fulfillment?.id) return;
    if (type === 'MEETUP') meetupMutation.mutate(fulfillment.id);
    else shipmentMutation.mutate(fulfillment.id);
  };

  if (isLoading) return <p>Loading…</p>;

  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

  return (
    <div className="max-w-xl rounded-xl bg-white p-8 shadow-sm">
      <Link to="/my/loans" className="text-sm text-brand-600 hover:underline">
        ← Back to loans
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Fulfillment</h1>
      <p className="text-sm text-slate-500">Loan {loanId?.slice(0, 8)}…</p>

      {suggestMeetup !== null && (
        <p className="mt-2 rounded-lg bg-brand-50 p-3 text-sm">
          {suggestMeetup
            ? `You have a saved address — meetup within ${MEETUP_THRESHOLD_KM} km is often easiest.`
            : 'Add coordinates on your profile address to get meetup vs mail suggestions.'}
        </p>
      )}

      {!fulfillment || fulfillment.status === 'DRAFT' ? (
        <form onSubmit={handleCreate} className="mt-6 space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={type === 'MEETUP'}
                onChange={() => setType('MEETUP')}
              />
              In-person meetup
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={type === 'MAIL'} onChange={() => setType('MAIL')} />
              Mail shipment
            </label>
          </div>
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-white">
            Start fulfillment
          </button>
        </form>
      ) : (
        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <p className="text-sm">
            Status: <strong>{fulfillment.status}</strong> · Type: {fulfillment.type || type}
          </p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={type === 'MEETUP'}
                onChange={() => setType('MEETUP')}
              />
              Meetup
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={type === 'MAIL'} onChange={() => setType('MAIL')} />
              Mail
            </label>
          </div>
          {type === 'MEETUP' ? (
            <>
              <input
                placeholder="Meeting location"
                value={location || fulfillment.meetup?.proposedLocation || ''}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
              <input
                type="datetime-local"
                value={proposedAt}
                onChange={(e) => setProposedAt(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
              <textarea
                placeholder="Notes"
                value={notes || fulfillment.meetup?.notes || ''}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
            </>
          ) : (
            <>
              <p className="text-sm text-slate-500">
                Ship from/to using address IDs on file. Your default:{' '}
                {defaultAddr ? `${defaultAddr.line1}, ${defaultAddr.city}` : 'none'}
              </p>
              <input
                placeholder="Carrier (USPS, UPS, …)"
                value={carrier || fulfillment.shipment?.carrier || ''}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
              <input
                placeholder="Tracking number"
                value={tracking || fulfillment.shipment?.trackingNumber || ''}
                onChange={(e) => setTracking(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
            </>
          )}
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-white">
            Save details
          </button>
        </form>
      )}
    </div>
  );
}
