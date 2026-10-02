import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function Wordmark() {
  return (
    <Link href="/" aria-label="Skew News home" className="flex items-baseline gap-1.5 leading-none">
      <span className="text-h2 font-bold text-text-primary">Skew</span>
      <span className="text-body-sm text-text-secondary">News</span>
    </Link>
  );
}

function NavigationLinks() {
  return (
    <>
      <Link href="/" className="font-semibold text-text-primary underline decoration-2 underline-offset-[22px]">Home</Link>
      <Link href="/" className="inline-flex items-start gap-1 text-text-primary">
        For You<span aria-hidden="true" className="mt-1 size-1 rounded-full bg-accent" />
      </Link>
      <Link href="/" className="text-text-primary">Local</Link>
      <Link href="/" className="text-text-primary">Blindspot</Link>
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-primary">
      <div className="mx-auto flex h-18 max-w-app items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <details className="group relative">
          <summary aria-label="Open navigation menu" className="grid size-9 cursor-pointer list-none place-items-center rounded-sm text-text-primary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
            <MenuIcon />
          </summary>
          <nav aria-label="More sections" className="absolute left-0 top-11 z-40 hidden min-w-44 border border-border bg-bg-primary p-2 shadow-md group-open:grid">
            <Link href="/" className="px-3 py-2 text-body-sm hover:bg-surface">Home</Link>
            <Link href="/" className="px-3 py-2 text-body-sm hover:bg-surface">For You</Link>
            <Link href="/" className="px-3 py-2 text-body-sm hover:bg-surface">Local</Link>
            <Link href="/" className="px-3 py-2 text-body-sm hover:bg-surface">Blindspot</Link>
          </nav>
        </details>

        <Wordmark />

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-body-sm lg:flex">
          <NavigationLinks />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Show when="signed-out">
            <SignUpButton mode="redirect">
              <Button variant="primary" className="rounded-md px-2 text-caption sm:px-4 sm:text-body-sm">Subscribe</Button>
            </SignUpButton>
            <SignInButton mode="redirect">
              <Button variant="outline" className="rounded-md px-2 text-caption sm:px-4 sm:text-body-sm">Login</Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}