import Link from "next/link";

function GlobeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function TopBar() {
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="bg-text-primary text-bg-primary">
      <div className="mx-auto flex min-h-10 max-w-app items-center justify-between gap-3 px-4 text-caption sm:px-6">
        <div className="flex items-center gap-3 text-bg-primary/75">
          <span className="hidden sm:inline">Browser Extension</span>
          <span className="hidden text-bg-primary/40 sm:inline" aria-hidden="true">·</span>
          <div className="flex items-center gap-2">
            <span>Theme:</span>
            <span className="font-semibold text-bg-primary">Light</span>
            <span>Dark</span>
            <span>Auto</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-bg-primary/80 sm:gap-3">
          <span className="hidden sm:inline">{date}</span>
          <span className="hidden text-bg-primary/40 sm:inline" aria-hidden="true">·</span>
          <Link href="/" className="hidden hover:text-bg-primary sm:inline">Set Location</Link>
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
              <GlobeIcon />
              <span>International Edition</span>
              <ChevronIcon />
            </summary>
            <div className="absolute right-0 top-7 z-40 min-w-44 border border-border bg-bg-primary p-2 text-text-primary shadow-md group-open:grid">
              <Link href="/" className="px-3 py-2 hover:bg-surface">International Edition</Link>
              <Link href="/" className="px-3 py-2 hover:bg-surface">United States</Link>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}