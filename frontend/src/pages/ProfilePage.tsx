import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { authApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user, refreshUser, token } = useAuth();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addrForm, setAddrForm] = useState({
    label: 'Home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    latitude: '',
    longitude: '',
    isDefault: true,
  });

  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => authApi.addresses().then((r) => r.data),
    enabled: !!token,
  });

  const profileMutation = useMutation({
    mutationFn: () => authApi.updateMe({ displayName, phone }),
    onSuccess: () => refreshUser(),
  });

  const addressMutation = useMutation({
    mutationFn: () =>
      authApi.createAddress({
        ...addrForm,
        latitude: addrForm.latitude ? parseFloat(addrForm.latitude) : undefined,
        longitude: addrForm.longitude ? parseFloat(addrForm.longitude) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setAddrForm({
        label: 'Home',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        latitude: '',
        longitude: '',
        isDefault: false,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => authApi.deleteAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });

  if (!token) return <p>Please sign in.</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Profile</h2>
        <p className="text-sm text-slate-500">{user?.email}</p>
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            profileMutation.mutate();
          }}
          className="mt-4 space-y-3"
        >
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name"
            className="w-full rounded-lg border px-3 py-2"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full rounded-lg border px-3 py-2"
          />
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-white">
            Save profile
          </button>
        </form>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Addresses</h2>
        <ul className="mb-4 space-y-2">
          {addresses.map((a) => (
            <li key={a.id} className="rounded border p-3 text-sm">
              <strong>{a.label || 'Address'}</strong>
              {a.isDefault && (
                <span className="ml-2 rounded bg-brand-100 px-1 text-xs">Default</span>
              )}
              <p>
                {a.line1}, {a.city}, {a.state} {a.postalCode}
              </p>
              {(a.latitude != null || a.longitude != null) && (
                <p className="text-xs text-slate-400">
                  {a.latitude}, {a.longitude}
                </p>
              )}
              <button
                type="button"
                onClick={() => deleteMutation.mutate(a.id)}
                className="mt-1 text-xs text-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            addressMutation.mutate();
          }}
          className="space-y-2"
        >
          <input
            required
            placeholder="Street"
            value={addrForm.line1}
            onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              required
              placeholder="City"
              value={addrForm.city}
              onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="State"
              value={addrForm.state}
              onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
              className="rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <input
            required
            placeholder="Postal code"
            value={addrForm.postalCode}
            onChange={(e) => setAddrForm({ ...addrForm, postalCode: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Latitude (for meetup hint)"
              value={addrForm.latitude}
              onChange={(e) => setAddrForm({ ...addrForm, latitude: e.target.value })}
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <input
              placeholder="Longitude"
              value={addrForm.longitude}
              onChange={(e) => setAddrForm({ ...addrForm, longitude: e.target.value })}
              className="rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white">
            Add address
          </button>
        </form>
      </div>
    </div>
  );
}
