"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth-context';

const navigation = [
  { label: 'Overview', href: '/admin' },
  { label: 'All Blogs', href: '/admin/blogs' },
  { label: 'Add Blog', href: '/admin/blogs/create' },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

  const sidebarContent = (
    <div className="flex h-full flex-col gap-6">
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
  );

  return (
    <div className="min-h-screen bg-bg text-ink lg:grid lg:grid-cols-[280px_1fr]">
      {/* Mobile Top Bar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-rule bg-paper/95 px-6 py-4 backdrop-blur-xl shadow-sm">
        <Link href="/admin" className="inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-paper text-lg font-display text-accent shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
            A
          </span>
          <span className="text-left">
            <span className="block font-display text-xl leading-none tracking-[-0.03em]">Aperture</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-muted">Admin console</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-full border border-rule bg-paper p-2.5 text-ink hover:border-accent transition"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative flex w-full max-w-[280px] flex-col bg-paper border-r border-rule p-5 shadow-2xl h-full overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-screen border-r border-rule bg-paper/95 px-5 py-8 overflow-y-auto">
        {sidebarContent}
      </aside>

      <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
