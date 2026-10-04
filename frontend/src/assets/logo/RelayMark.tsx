type RelayMarkProps = {
  className?: string;
};

/** Small icon: open book pages with a relay arc passing between them. */
export function RelayMark({ className = 'h-10 w-10' }: RelayMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="40" height="40" rx="10" className="fill-brand-600" />
      <path
        d="M11 28V12c0-1 1.2-1.6 2.1-1.1l6.9 3.9v13.2l-6.9-3.9A1.2 1.2 0 0 1 11 28Z"
        className="fill-white/95"
      />
      <path
        d="M29 28V12c0-1-1.2-1.6-2.1-1.1l-6.9 3.9v13.2l6.9-3.9A1.2 1.2 0 0 0 29 28Z"
        className="fill-white/70"
      />
      <path
        d="M20 11c3.5 0 6.5 2.2 7.6 5.3"
        className="stroke-amber-300"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27.8 18.5 30 16.3l-2.2-2.2"
        className="stroke-amber-300"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="11" r="1.5" className="fill-amber-300" />
    </svg>
  );
}
