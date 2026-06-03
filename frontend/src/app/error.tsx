"use client";

import Link from 'next/link';
import { useEffect } from 'react';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 text-ink">
      <div className="max-w-xl rounded-[28px] border border-rule bg-paper px-8 py-10 text-center shadow-[0_20px_80px_rgba(27,40,69,0.08)]">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Something went wrong</p>
        <h1 className="mt-4 font-display text-4xl font-normal tracking-[-0.03em]">Aperture hit an error</h1>
        <p className="mt-4 font-serif text-lg leading-8 text-muted">
          {error.message || 'Please try again. If the problem keeps happening, check the backend logs.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-rule bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:border-accent hover:bg-bg"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
