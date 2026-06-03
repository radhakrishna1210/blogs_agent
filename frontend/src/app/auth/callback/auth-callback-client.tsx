"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';

export function AuthCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [message, setMessage] = useState('Finishing sign in...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setMessage('Missing login token. Redirecting to home...');
      router.replace('/');
      return;
    }

    login(token);
    setMessage('Signed in successfully. Redirecting...');
    router.replace('/');
  }, [login, router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 text-ink">
      <div className="rounded-[28px] border border-rule bg-paper px-8 py-10 text-center shadow-[0_20px_80px_rgba(27,40,69,0.08)]">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Authentication</p>
        <h1 className="mt-3 font-display text-4xl font-normal tracking-[-0.03em]">Aperture</h1>
        <p className="mt-4 font-serif text-lg text-muted">{message}</p>
      </div>
    </main>
  );
}