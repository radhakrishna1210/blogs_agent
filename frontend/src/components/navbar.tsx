"use client";

import Link from 'next/link';
import { useState } from 'react';
import type { Topic } from '../lib/topics';

type NavbarProps = {
  topics: Topic[];
};

export function Navbar({ topics }: NavbarProps) {
  const primaryTopics = topics.slice(0, 5);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-rule/90 bg-bg/90 backdrop-blur-xl">
      {/* Top utility bar */}
      <div className="border-b border-rule/70 px-4 py-2 text-[11px] tracking-[0.08em] text-muted sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <span>Vol. II · Aperture editorial system</span>
          <span className="hidden md:inline">Warm palette · React design · ready for backend wiring</span>
        </div>
      </div>

      {/* Main navbar row */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6 lg:py-5">
          {/* Logo */}
          <div className="flex lg:justify-start">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-paper text-lg font-display text-accent shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] sm:h-10 sm:w-10 sm:text-xl">
                A
              </span>
              <span className="text-left">
                <span className="block font-display text-2xl leading-none tracking-[-0.03em] sm:text-3xl">Aperture</span>
                <span className="block text-[10px] text-muted sm:text-xs">A publication of essays</span>
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex lg:flex-wrap lg:justify-center lg:gap-2.5">
            <Link
              href="/blogs"
              className="rounded-full border border-accent bg-accent px-4 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:opacity-95"
            >
              Blogs
            </Link>
            {primaryTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/category/${topic.slug}`}
                className="rounded-full border border-rule px-4 py-2 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent hover:bg-paper"
              >
                {topic.title}
              </Link>
            ))}
          </nav>

          {/* Desktop spacer for 3-column centering */}
          <div className="hidden lg:block" />

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-rule bg-paper text-ink transition hover:border-accent lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <div className="flex flex-col items-center justify-center gap-[5px]">
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${mobileOpen ? 'translate-y-[7px] rotate-45' : ''}`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${mobileOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      <div
        className={`overflow-hidden border-t border-rule/60 transition-all duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 border-t-transparent opacity-0'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          <Link
            href="/blogs"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-2xl border border-accent bg-accent px-5 py-3.5 text-sm font-medium text-paper transition active:scale-[0.98]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            All Blogs
          </Link>

          <div className="my-2 px-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Topics</p>
          </div>

          {primaryTopics.map((topic, index) => (
            <Link
              key={topic.slug}
              href={`/category/${topic.slug}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-2xl border border-rule/60 bg-paper px-5 py-3.5 text-sm font-medium text-ink transition hover:border-accent active:scale-[0.98]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="flex h-2 w-2 rounded-full bg-accent/60" />
              {topic.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
