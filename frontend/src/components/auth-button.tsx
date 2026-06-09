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
        className="inline-flex items-center gap-3 rounded-full border border-rule bg-paper px-3 py-2 text-sm font-medium text-ink transition hover:border-accent"
      >
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-soft">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.336 0 3.327 2.673 1.345 6.573L5.266 9.765z"
            />
            <path
              fill="#34A853"
              d="M16.04 15.345c-1.073.71-2.437 1.127-4.04 1.127a7.077 7.077 0 0 1-6.734-4.855L1.345 14.81c1.982 3.9 5.991 6.573 10.655 6.573 2.927 0 5.618-.982 7.645-2.682l-3.609-3.355z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.273c0-.818-.082-1.609-.218-2.382H12v4.518h6.464a5.536 5.536 0 0 1-2.418 3.636l3.609 3.355c2.109-1.945 3.836-4.8 3.836-9.127z"
            />
            <path
              fill="#FBBC05"
              d="M5.266 14.235A7.01 7.01 0 0 1 4.909 12c0-.79.127-1.555.357-2.264L1.345 6.573A11.934 11.934 0 0 0 0 12c0 1.927.455 3.755 1.345 5.427l3.921-3.192z"
            />
          </svg>
        </span>
        <span>Continue with Google</span>
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
