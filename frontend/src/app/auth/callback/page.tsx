import { Suspense } from 'react';
import { AuthCallbackClient } from './auth-callback-client';

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-bg px-6 text-ink">
          <div className="rounded-[28px] border border-rule bg-paper px-8 py-10 text-center shadow-[0_20px_80px_rgba(27,40,69,0.08)]">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Authentication</p>
            <h1 className="mt-3 font-display text-4xl font-normal tracking-[-0.03em]">Aperture</h1>
            <p className="mt-4 font-serif text-lg text-muted">Finishing sign in...</p>
          </div>
        </main>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
