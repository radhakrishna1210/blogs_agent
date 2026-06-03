"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useAuth } from '../context/auth-context';

function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
}

export function AuthButton() {
  const { user, isReady, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const loginHref = useMemo(() => `${getBackendBaseUrl()}/auth/google`, []);

  if (!isReady) {
    return (
      <span className="inline-flex items-center rounded-full border border-rule px-5 py-2.5 text-sm font-medium text-muted">
        Loading...
      </span>
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => {
          window.location.href = loginHref;
        }}
        className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent"
      >
        Continue with Google
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-3 rounded-full border border-rule bg-paper px-3 py-2 text-sm font-medium text-ink transition hover:border-accent"
      >
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-soft text-xs font-semibold text-ink">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            user.name.slice(0, 1).toUpperCase()
          )}
        </span>
        <span className="max-w-[140px] truncate">{user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-3 w-48 overflow-hidden rounded-2xl border border-rule bg-paper p-2 shadow-[0_18px_50px_rgba(27,40,69,0.14)]">
          {user.role === 'admin' ? (
            <Link
              href="/admin"
              className="block rounded-xl px-4 py-3 text-sm text-ink transition hover:bg-bg"
              onClick={() => setOpen(false)}
            >
              Admin dashboard
            </Link>
          ) : null}
          <Link
            href="/profile"
            className="block rounded-xl px-4 py-3 text-sm text-ink transition hover:bg-bg"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <button
            type="button"
            className="block w-full rounded-xl px-4 py-3 text-left text-sm text-ink transition hover:bg-bg"
            onClick={() => {
              setOpen(false);
              logout();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
