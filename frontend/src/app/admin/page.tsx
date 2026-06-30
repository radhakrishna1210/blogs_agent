"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { apiRequest } from '../../lib/api';
import type { AdminDashboardResponse, AdminBlog } from '../../lib/admin-types';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function BlogStatus({ status }: { status: string }) {
  const tone = status === 'published' ? 'bg-accent/12 text-accent' : 'bg-soft text-ink';
  return <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${tone}`}>{status}</span>;
}

function StatCard({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="rounded-[24px] border border-rule bg-paper p-6 shadow-[0_14px_50px_rgba(27,40,69,0.06)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-4 font-display text-5xl font-normal tracking-[-0.04em] text-ink">{value}</p>
      <p className="mt-3 text-sm leading-6 text-muted">{hint}</p>
    </div>
  );
}

// ─── Auto-Posting Toggle ──────────────────────────────────────────────────────

function AutoPostingToggle({ token }: { token: string }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  // Load current setting on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await apiRequest<{ ok: true; auto_posting_enabled: boolean }>(
          '/api/admin/settings',
          { token }
        );
        if (!cancelled) setEnabled(res.auto_posting_enabled);
      } catch {
        if (!cancelled) setEnabled(true); // fallback default
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [token]);

  async function toggle() {
    if (enabled === null || saving) return;
    const next = !enabled;
    setSaving(true);
    setStatus('idle');
    try {
      await apiRequest<{ ok: true; auto_posting_enabled: boolean }>(
        '/api/admin/settings',
        { token, method: 'PATCH', body: { auto_posting_enabled: next } }
      );
      setEnabled(next);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  }

  const isOn = enabled === true;
  const isLoading = enabled === null;

  return (
    <div className="rounded-[28px] border border-rule bg-paper px-6 py-7 shadow-[0_14px_50px_rgba(27,40,69,0.06)] md:px-8">
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border transition-colors duration-300 ${
            isOn ? 'border-accent/30 bg-accent/10' : 'border-rule bg-bg'
          }`}>
            <svg className={`h-5 w-5 transition-colors duration-300 ${isOn ? 'text-accent' : 'text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Automation</p>
            <h2 className="mt-1 font-display text-2xl font-normal tracking-[-0.03em]">Auto-posting</h2>
            <p className="mt-1.5 max-w-sm font-serif text-sm leading-6 text-muted">
              When <strong className="font-semibold text-ink">ON</strong>, the scheduled workflow will automatically publish queued blog posts. When <strong className="font-semibold text-ink">OFF</strong>, the workflow skips publishing.
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <div className="flex flex-shrink-0 flex-col items-start gap-2 sm:items-end">
          <button
            type="button"
            id="auto-posting-toggle"
            role="switch"
            aria-checked={isOn}
            onClick={toggle}
            disabled={isLoading || saving}
            className={`relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full border-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-wait ${
              isOn
                ? 'border-accent bg-accent shadow-[0_4px_12px_rgba(184,96,64,0.28)]'
                : 'border-rule bg-rule/40'
            }`}
            aria-label="Toggle automated blog posting"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-paper shadow-sm transition-transform duration-300 ${
                isOn ? 'translate-x-5' : 'translate-x-0.5'
              } ${saving ? 'opacity-60' : ''}`}
            />
          </button>

          {/* Status label */}
          <span className={`font-sans text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
            isLoading ? 'text-muted' : isOn ? 'text-accent' : 'text-muted'
          }`}>
            {isLoading ? 'Loading…' : isOn ? '● Active' : '○ Paused'}
          </span>
        </div>
      </div>

      {/* Status feedback */}
      {status !== 'idle' && (
        <div className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
          status === 'saved'
            ? 'bg-accent/8 text-accent'
            : 'bg-red-50 text-red-700'
        }`}>
          {status === 'saved'
            ? `✓ Auto-posting is now ${enabled ? 'enabled' : 'disabled'}. Changes take effect on the next scheduled run.`
            : '✗ Failed to save setting. Please try again.'}
        </div>
      )}

      {/* Info note */}
      <div className="mt-5 rounded-2xl border border-rule/70 bg-bg px-4 py-3 text-[12px] text-muted">
        <span className="font-semibold text-ink">How it works:</span> The GitHub Actions workflow calls{' '}
        <code className="rounded bg-rule/40 px-1 font-mono text-[11px]">POST /api/admin/auto-publish</code>{' '}
        on a schedule. This toggle controls whether that endpoint proceeds or skips.
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOverviewPage() {
  const { token, isReady } = useAuth();
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !token) {
      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        const response = await apiRequest<AdminDashboardResponse>('/api/admin/dashboard', { token });
        if (!cancelled) {
          setData(response);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [isReady, token]);

  return (
    <section className="space-y-8">
      {/* Page header */}
      <div className="rounded-[32px] border border-rule bg-paper px-6 py-8 shadow-[0_20px_70px_rgba(27,40,69,0.08)] md:px-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Overview</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-normal tracking-[-0.04em] md:text-6xl">Admin dashboard</h1>
            <p className="mt-4 max-w-2xl font-serif text-lg leading-8 text-muted">
              A clean control room for Aperture. Track content volume, users, likes, and the latest published pieces at a glance.
            </p>
          </div>

          <Link
            href="/admin/generate-blog"
            className="inline-flex items-center justify-center rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent"
          >
            Generate a blog
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-[24px] border border-accent/30 bg-accent/8 px-5 py-4 text-sm text-accent">{error}</div>
      ) : null}

      {/* Auto-Posting Toggle */}
      {token && <AutoPostingToggle token={token} />}

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Total blogs" value={loading || !data ? 0 : data.stats.totalBlogs} hint="All records across drafts and published posts." />
        <StatCard label="Total users" value={loading || !data ? 0 : data.stats.totalUsers} hint="Registered accounts in the Aperture community." />
        <StatCard label="Total likes" value={loading || !data ? 0 : data.stats.totalLikes} hint="Likes captured across every post." />
      </div>

      {/* Recent blogs */}
      <div className="rounded-[32px] border border-rule bg-paper p-6 shadow-[0_14px_50px_rgba(27,40,69,0.06)] md:p-8">
        <div className="flex flex-col gap-2 border-b border-rule pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Latest</p>
            <h2 className="mt-2 font-display text-3xl font-normal tracking-[-0.03em]">Most recent blogs</h2>
          </div>
          <Link href="/admin/blogs" className="text-sm font-medium text-accent transition hover:text-ink">
            View all blogs
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {!loading && data?.recentBlogs.length ? (
            data.recentBlogs.map((blog: AdminBlog) => (
              <article key={blog.id} className="rounded-[24px] border border-rule bg-bg p-6 shadow-sm transition hover:shadow-md">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-serif text-xl font-medium text-ink leading-snug">{blog.title}</h3>
                      <BlogStatus status={blog.status} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink/80">{blog.summary || 'No summary available yet.'}</p>
                  </div>
                  <div className="text-left md:text-right flex-shrink-0 pt-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {blog.category?.name || 'Uncategorized'}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {formatDate(blog.created_at)} · {blog.likes_count} likes
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-rule bg-bg px-6 py-10 text-center text-muted">
              {loading ? 'Loading recent blogs...' : 'No blogs have been created yet.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
