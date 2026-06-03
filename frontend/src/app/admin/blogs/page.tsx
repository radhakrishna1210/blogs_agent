"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/auth-context';
import { apiRequest } from '../../../lib/api';
import type { AdminBlogsResponse, AdminBlog } from '../../../lib/admin-types';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function statusTone(status: string) {
  if (status === 'published') {
    return 'bg-accent/12 text-accent';
  }

  if (status === 'draft') {
    return 'bg-soft text-ink';
  }

  return 'bg-bg text-muted';
}

export default function AdminBlogsPage() {
  const { token, isReady } = useAuth();
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !token) {
      return;
    }

    let cancelled = false;

    async function loadBlogs() {
      try {
        setLoading(true);
        const response = await apiRequest<AdminBlogsResponse>('/api/admin/blogs', { token });
        if (!cancelled) {
          setBlogs(response.blogs);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load blogs.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadBlogs();

    return () => {
      cancelled = true;
    };
  }, [isReady, token]);

  async function handleDelete(blogId: string) {
    if (!token) {
      return;
    }

    const confirmed = window.confirm('Delete this blog? This cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(blogId);
      await apiRequest<{ ok: true; deleted: boolean }>(`/api/blogs/${blogId}`, {
        method: 'DELETE',
        token,
      });
      setBlogs((currentBlogs) => currentBlogs.filter((blog) => blog.id !== blogId));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete blog.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-rule bg-paper px-6 py-8 shadow-[0_20px_70px_rgba(27,40,69,0.08)] md:px-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">All blogs</p>
        <h1 className="mt-4 font-display text-4xl font-normal tracking-[-0.04em] md:text-6xl">Manage every post</h1>
        <p className="mt-4 max-w-2xl font-serif text-lg leading-8 text-muted">
          Review status, category, publish dates, and likes. Delete rows directly from the table without reloading the page.
        </p>
      </div>

      {error ? <div className="rounded-[24px] border border-accent/30 bg-accent/8 px-5 py-4 text-sm text-accent">{error}</div> : null}

      <div className="overflow-hidden rounded-[32px] border border-rule bg-paper shadow-[0_14px_50px_rgba(27,40,69,0.06)]">
        <div className="border-b border-rule px-6 py-5 md:px-8">
          <p className="text-sm text-muted">{loading ? 'Loading blogs...' : `${blogs.length} blog${blogs.length === 1 ? '' : 's'} loaded`}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-rule">
            <thead className="bg-bg text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              <tr>
                <th className="px-6 py-4 md:px-8">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Likes</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule bg-paper text-sm text-ink">
              {!loading && blogs.length ? (
                blogs.map((blog) => (
                  <tr key={blog.id} className="align-top">
                    <td className="px-6 py-5 md:px-8">
                      <div className="max-w-md">
                        <p className="font-serif text-lg text-ink">{blog.title}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{blog.summary || blog.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-muted">{blog.category?.name || 'Uncategorized'}</td>
                    <td className="px-6 py-5 text-muted">{formatDate(blog.created_at)}</td>
                    <td className="px-6 py-5 text-muted">{blog.likes_count}</td>
                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusTone(blog.status)}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right md:px-8">
                      <button
                        type="button"
                        onClick={() => void handleDelete(blog.id)}
                        disabled={deletingId === blog.id}
                        className="inline-flex items-center justify-center rounded-full border border-accent px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === blog.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-muted md:px-8">
                    {loading ? 'Loading blog table...' : 'No blogs found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
