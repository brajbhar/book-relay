import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) return <p className="p-8">Loading…</p>;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
