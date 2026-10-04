import { Link } from 'react-router-dom';
import { RelayMark } from '../assets/logo/RelayMark';

type LogoProps = {
  showText?: boolean;
  showMark?: boolean;
  className?: string;
};

export function Logo({ showText = true, showMark = true, className = '' }: LogoProps) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}
    >
      {showMark && (
        <RelayMark className="h-10 w-10 shrink-0 shadow-sm transition-transform group-hover:scale-105" />
      )}

      {showText && (
        <span className="flex flex-col leading-none">
          <span className="flex items-center gap-1 sm:gap-1.5">
            <span className="font-serif text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
              Book
            </span>

            <span className="flex items-center px-0.5 text-brand-400" aria-hidden>
              <span className="hidden h-px w-2 bg-brand-200 sm:block" />
              <svg viewBox="0 0 36 12" className="h-3 w-9 sm:h-3.5 sm:w-10" fill="none">
                <path
                  d="M2 6h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="2 3"
                  opacity="0.55"
                />
                <path
                  d="M10 6c4 0 7-3 7-3s3 3 7 3"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M22 3l3 3-3 3"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M25 6h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="2 3"
                  opacity="0.55"
                />
              </svg>
              <span className="hidden h-px w-2 bg-brand-200 sm:block" />
            </span>

            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-blue-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
              Relay
            </span>
          </span>

          <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400 sm:block">
            Share · Borrow · Pass on
          </span>
        </span>
      )}
    </Link>
  );
}
