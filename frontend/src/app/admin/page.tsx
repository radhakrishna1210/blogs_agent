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

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Total blogs" value={loading || !data ? 0 : data.stats.totalBlogs} hint="All records across drafts and published posts." />
        <StatCard label="Total users" value={loading || !data ? 0 : data.stats.totalUsers} hint="Registered accounts in the Aperture community." />
        <StatCard label="Total likes" value={loading || !data ? 0 : data.stats.totalLikes} hint="Likes captured across every post." />
      </div>

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
