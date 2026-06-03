"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../context/auth-context';

const navigation = [
  { label: 'Overview', href: '/admin' },
  { label: 'All Blogs', href: '/admin/blogs' },
  { label: 'Generate Blog', href: '/admin/generate-blog' },
  { label: 'Categories', href: '/admin/categories' },
];

function isActive(pathname: string, href: string) {
  if (href === '/admin') {
    return pathname === '/admin';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, isReady, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.replace('/');
    }
  }, [isReady, router, user]);

  if (!isReady || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-bg px-6 py-20 text-ink lg:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-center rounded-[28px] border border-rule bg-paper px-8 py-16 text-center shadow-[0_20px_80px_rgba(27,40,69,0.08)]">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Admin access</p>
            <h1 className="mt-4 font-display text-4xl font-normal tracking-[-0.03em]">Checking permissions...</h1>
            <p className="mt-4 font-serif text-lg leading-8 text-muted">
              This area is reserved for Aperture administrators only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-rule bg-paper/95 px-6 py-6 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-8">
        <div className="flex h-full flex-col gap-8">
          <div className="rounded-[24px] border border-rule bg-bg p-5 shadow-[0_12px_40px_rgba(27,40,69,0.06)]">
            <div className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-paper text-xl font-display text-accent shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
                A
              </span>
              <div>
                <p className="font-display text-3xl leading-none tracking-[-0.03em]">Aperture</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Admin console</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-rule bg-paper px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Signed in as</p>
              <p className="mt-2 truncate font-medium text-ink">{user.name}</p>
              <p className="truncate text-sm text-muted">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    active
                      ? 'border-accent bg-accent text-paper shadow-[0_10px_28px_rgba(184,96,64,0.18)]'
                      : 'border-rule bg-paper text-ink hover:-translate-y-0.5 hover:border-accent hover:bg-bg'
                  }`}
                >
                  <span>{item.label}</span>
                  {active ? <span className="text-xs uppercase tracking-[0.18em] text-paper/80">Active</span> : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3 rounded-[24px] border border-rule bg-bg p-5">
            <Link
              href="/"
              className="flex items-center justify-between rounded-2xl border border-rule bg-paper px-4 py-3 text-sm font-medium text-ink transition hover:border-accent hover:bg-bg"
            >
              <span>Back to site</span>
              <span className="text-accent">↗</span>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-between rounded-2xl border border-rule bg-paper px-4 py-3 text-sm font-medium text-ink transition hover:border-accent hover:bg-bg"
            >
              <span>Logout</span>
              <span className="text-accent">⟲</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="px-6 py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
