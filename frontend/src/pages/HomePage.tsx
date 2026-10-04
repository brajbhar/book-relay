import { Link } from 'react-router-dom';
import { RelayMark } from '../assets/logo/RelayMark';
import { useAuth } from '../context/AuthContext';

const steps = [
  {
    title: 'List your books',
    description: 'Share titles you have finished reading and are ready to pass on to another reader.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path d="M8 7h8M8 11h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Find something nearby',
    description: 'Browse available books by title, author, or postal code and request a borrow.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Relay it forward',
    description: 'Meet up locally or arrange shipping, read the book, then share it with the next person.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M5 12h6M13 12h6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
        <path
          d="M11 12c2.5-2.5 5.5-2.5 8 0"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M17 9.5 19.5 12 17 14.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const highlights = [
  {
    title: 'Community-powered',
    description: 'Every book on Book Relay comes from a real reader in your area—not a warehouse.',
  },
  {
    title: 'Keep stories moving',
    description: 'Give finished books a second life instead of letting them gather dust on a shelf.',
  },
  {
    title: 'Simple & local',
    description: 'Search by postal code, connect with owners nearby, and arrange pickup on your terms.',
  },
];

export function HomePage() {
  const { token } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-slate-50 pb-20 pt-10 sm:pb-28 sm:pt-16">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl"
          aria-hidden
        />

        <div className="page-container relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur">
                <RelayMark className="h-5 w-5" />
                Share · Borrow · Pass on
              </p>

              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Your next great read is{' '}
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-blue-500 bg-clip-text text-transparent">
                  one relay away
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                Book Relay connects readers who want to lend physical books with people looking for
                their next story—locally, simply, and sustainably.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/browse"
                  className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-800 hover:shadow-lg"
                >
                  Browse available books
                </Link>
                {token ? (
                  <Link
                    to="/my/listings"
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    List a book
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    Join for free
                  </Link>
                )}
              </div>

              <p className="mt-6 text-sm text-slate-500">
                No fees to browse. List and borrow with readers near you.
              </p>
            </div>

            {/* Decorative book stack */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 shadow-2xl shadow-brand-800/30 sm:p-5">
                <div className="absolute right-4 top-4 z-10 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
                  <p className="text-2xl font-bold text-brand-600">♥</p>
                  <p className="text-xs font-medium text-slate-600">Reader to reader</p>
                </div>

                <div className="rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur sm:p-8">
                  <div className="pr-24">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                      Now lending nearby
                    </p>
                    <p className="mt-2 font-serif text-2xl font-bold text-slate-900">
                      Astrophysics, fiction, memoirs & more
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Real books from real readers—search by title, author, or postal code.
                    </p>
                  </div>

                  <div className="mt-6 space-y-2.5">
                    {['The Three-Body Problem', 'A Brief History of Time', 'Project Hail Mary'].map(
                      (title) => (
                        <div
                          key={title}
                          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5"
                        >
                          <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded bg-brand-100 text-sm">
                            📖
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800">{title}</p>
                            <p className="text-xs text-green-600">Available</p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                      Relay chain
                    </p>
                    <p className="text-sm font-medium text-slate-700">Book → You → Next reader</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="page-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">How it works</h2>
            <p className="mt-3 text-slate-600">
              Three simple steps to start sharing stories with your community.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center sm:text-left">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 sm:mx-0">
                  {step.icon}
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-brand-600">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 sm:py-20">
        <div className="page-container">
          <div className="grid gap-6 lg:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 sm:pb-24">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 px-6 py-12 text-center shadow-xl sm:px-12 sm:py-16">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-amber-400/20 blur-2xl"
              aria-hidden
            />

            <h2 className="relative font-serif text-3xl font-bold text-white sm:text-4xl">
              Ready to start your next chapter?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-brand-100">
              Explore books available to borrow today, or create an account to list your own and join
              the relay.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/browse"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Explore the catalog
              </Link>
              {!token && (
                <Link
                  to="/register"
                  className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Create free account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
