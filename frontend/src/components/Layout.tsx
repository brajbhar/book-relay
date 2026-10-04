import { Logo } from './Logo';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? 'text-brand-600 font-semibold'
    : 'text-slate-600 hover:text-brand-600';
}

export function Layout() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="page-container flex items-center justify-between gap-4 py-4">
          <Logo />
          <nav className="flex flex-wrap items-center justify-end gap-3 text-sm font-medium sm:gap-4">
            <NavLink to="/browse" className={navLinkClass}>
              Browse
            </NavLink>
            {token && (
              <>
                <Link
                  to="/my/listings"
                  className="rounded-lg border border-brand-600 px-3 py-1.5 text-brand-600 hover:bg-brand-50"
                >
                  List a book
                </Link>
                <NavLink to="/my/listings" className={navLinkClass}>
                  My Listings
                </NavLink>
                <NavLink to="/my/requests" className={navLinkClass}>
                  My Requests
                </NavLink>
                <NavLink to="/my/inbox" className={navLinkClass}>
                  Inbox
                </NavLink>
                <NavLink to="/my/loans" className={navLinkClass}>
                  Loans
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              </>
            )}
            {token ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-600 hover:bg-slate-200"
              >
                Logout ({user?.displayName})
              </button>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <Link
                  to="/register"
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-800"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className={isHome ? '' : 'page-container py-8'}>
        <Outlet />
      </main>
    </div>
  );
}
