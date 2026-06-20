"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/auth-context';
import { apiRequest } from '../lib/api';
import type { PublicBlog, BlogsResponse } from '../lib/blog-types';
import { BlogCard } from './blog-card';

type BlogArticlePageProps = {
  blog: PublicBlog;
  relatedBlogs: PublicBlog[];
};

function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function stripUnsafeHtml(html: string) {
  const source = String(html || '');

  return source
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?<\/embed>/gi, '')
    .replace(/<form[\s\S]*?<\/form>/gi, '')
    .replace(/<(input|button)[^>]*>/gi, '')
    .replace(/ on[a-z]+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/href=("|')?javascript:[^"'\s>]+("|')?/gi, 'href="#"')
    .replace(/src=("|')?javascript:[^"'\s>]+("|')?/gi, 'src="#"');
}

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />;
}

export function BlogArticlePage({ blog, relatedBlogs }: BlogArticlePageProps) {
  const { user, token, isReady } = useAuth();
  const [likesCount, setLikesCount] = useState(blog.likes_count || 0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const sanitizedHtml = useMemo(() => stripUnsafeHtml(blog.content), [blog.content]);

  useEffect(() => {
    if (!isReady || !token) {
      return;
    }

    let cancelled = false;

    async function loadLikeState() {
      try {
        const response = await apiRequest<{ ok: true; liked: boolean }>(`/api/blogs/${blog.id}/liked`, {
          token,
        });

        if (!cancelled) {
          setLiked(response.liked);
        }
      } catch {
        if (!cancelled) {
          setLiked(false);
        }
      }
    }

    void loadLikeState();

    return () => {
      cancelled = true;
    };
  }, [blog.id, isReady, token]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 2200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast]);

  async function handleLike() {
    if (!user || !token) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setLikeLoading(true);
      const response = await apiRequest<{ ok: true; liked: boolean; likes_count: number }>(`/api/blogs/${blog.id}/like`, {
        method: 'POST',
        token,
      });

      setLiked(response.liked);
      setLikesCount(response.likes_count);
    } catch {
      setToast('Unable to update like right now.');
    } finally {
      setLikeLoading(false);
    }
  }

  async function handleShare() {
    const currentUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(currentUrl);
      setToast('Link copied');
    } catch {
      setToast('Could not copy the link.');
    }
  }

  return (
    <main className="min-h-screen bg-bg text-ink">
      <article className="mx-auto max-w-4xl px-4 py-6 sm:px-6 md:px-8 md:py-14">
        <div className="overflow-hidden rounded-[20px] border border-rule bg-paper shadow-[0_20px_70px_rgba(27,40,69,0.08)] sm:rounded-[32px]">
          <div className="aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/8] bg-soft relative overflow-hidden">
            {blog.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={blog.cover_image_url} alt={blog.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(184,96,64,0.9),rgba(90,122,110,0.84))]">
                <span className="font-display text-4xl sm:text-6xl text-paper/90">Aperture</span>
              </div>
            )}
          </div>

          <div className="px-4 py-6 sm:px-8 md:px-10 md:py-10">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              {blog.category ? (
                <Link
                  href={`/category/${blog.category.slug}`}
                  className="rounded-full border border-rule bg-bg px-3 py-1.5 text-ink transition hover:border-accent hover:bg-paper"
                >
                  {blog.category.name}
                </Link>
              ) : null}
              <span>{formatPublishedDate(blog.created_at)}</span>
              <span>•</span>
              <span>{blog.read_time || 1} min read</span>
            </div>

            <h1 className="mt-4 max-w-3xl font-display text-[26px] font-normal leading-[1.15] tracking-[-0.04em] text-ink sm:mt-5 sm:text-5xl md:text-7xl md:leading-tight">
              {blog.title}
            </h1>

            <div className="mt-6 flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-rule bg-soft text-sm font-semibold text-ink">
                  {blog.author?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={blog.author.avatar_url} alt={blog.author.name} className="h-full w-full object-cover" />
                  ) : (
                    blog.author?.name?.slice(0, 1).toUpperCase() || 'A'
                  )}
                </div>
                <div>
                  <p className="font-medium text-ink">{blog.author?.name || 'Aperture Editorial'}</p>
                  <p className="text-sm text-muted">Published in Aperture</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => void handleLike()}
                  disabled={likeLoading}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-5 sm:py-3 ${
                    liked
                      ? 'border-accent bg-accent text-paper'
                      : 'border-ink bg-ink text-paper hover:border-accent hover:bg-accent'
                  }`}
                >
                  {likeLoading ? <Spinner /> : null}
                  {liked ? 'Liked' : 'Like'}
                  <span className="rounded-full bg-white/15 px-2 py-0.5 font-mono text-xs">{likesCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleShare()}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-rule bg-paper px-4 py-2.5 text-sm font-medium text-ink transition hover:border-accent hover:bg-bg sm:flex-none sm:px-5 sm:py-3"
                >
                  Share
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-[16px] border border-rule bg-bg p-4 sm:mt-8 sm:rounded-[20px] sm:p-6 md:rounded-[28px] md:p-8">
              <div
                className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-normal prose-headings:tracking-[-0.03em] prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:font-serif prose-p:text-[16px] sm:prose-p:text-[17px] prose-p:leading-8 prose-li:font-serif prose-li:text-[16px] sm:prose-li:text-[17px] prose-a:text-accent prose-img:rounded-[20px] prose-blockquote:border-accent prose-blockquote:font-serif prose-blockquote:not-italic"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
            </div>
          </div>
        </div>

        <section className="mt-8 sm:mt-10">
          <div className="mb-4 flex flex-col gap-2 border-b border-rule pb-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pb-4">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Related</p>
              <h2 className="mt-1.5 font-display text-2xl font-normal tracking-[-0.03em] sm:mt-2 sm:text-3xl">More from this category</h2>
            </div>
            {blog.category ? (
              <Link href={`/category/${blog.category.slug}`} className="text-sm font-medium text-accent transition hover:text-ink">
                View category
              </Link>
            ) : null}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {relatedBlogs.map((relatedBlog) => (
              <BlogCard key={relatedBlog.id} blog={relatedBlog} />
            ))}
          </div>
        </section>
      </article>

      {showLoginPopup ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 px-6" onClick={() => setShowLoginPopup(false)}>
          <div
            className="w-full max-w-md rounded-[28px] border border-rule bg-paper p-6 shadow-[0_24px_80px_rgba(27,40,69,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Login required</p>
            <h3 className="mt-3 font-display text-3xl font-normal tracking-[-0.03em] text-ink">Please login to like</h3>
            <p className="mt-3 font-serif text-[16px] leading-7 text-muted">
              You need to sign in before saving a like on this article.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center rounded-full border border-ink bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent"
              >
                Go to login
              </Link>
              <button
                type="button"
                onClick={() => setShowLoginPopup(false)}
                className="inline-flex items-center rounded-full border border-rule bg-paper px-5 py-3 text-sm font-medium text-ink transition hover:border-accent hover:bg-bg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-rule bg-paper px-5 py-3 text-sm font-medium text-ink shadow-[0_18px_50px_rgba(27,40,69,0.16)]">
          {toast}
        </div>
      ) : null}
    </main>
  );
}
