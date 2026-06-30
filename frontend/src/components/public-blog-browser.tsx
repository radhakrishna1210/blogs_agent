"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import type { BlogsResponse, CategoriesResponse, PublicBlog, PublicBlogCategory } from '../lib/blog-types';
import { BlogCard } from './blog-card';

type PublicBlogBrowserProps = {
  mode: 'all' | 'category';
  categorySlug?: string;
  categoryLabel?: string;
};

function buildQueryPath(params: { category?: string; search?: string; page?: number; limit?: number }) {
  const query = new URLSearchParams();
  query.set('page', String(params.page || 1));
  query.set('limit', String(params.limit || 12));

  if (params.category) {
    query.set('category', params.category);
  }

  if (params.search) {
    query.set('search', params.search);
  }

  return `/api/blogs?${query.toString()}`;
}

async function loadAllBlogs(filters: { category?: string; search?: string }) {
  const pageSize = 12;
  let page = 1;
  let totalPages = 1;
  const blogs: PublicBlog[] = [];

  do {
    const response = await apiRequest<BlogsResponse>(buildQueryPath({
      category: filters.category,
      search: filters.search,
      page,
      limit: pageSize,
    }));

    blogs.push(...response.blogs);
    totalPages = response.totalPages || 1;
    page += 1;
  } while (page <= totalPages);

  return blogs;
}

export function PublicBlogBrowser({ mode, categorySlug, categoryLabel }: PublicBlogBrowserProps) {
  const [categories, setCategories] = useState<PublicBlogCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(categorySlug || 'all');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [blogs, setBlogs] = useState<PublicBlog[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(mode === 'all');
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== 'all') {
      return;
    }

    let cancelled = false;

    async function loadCategories() {
      try {
        setLoadingCategories(true);
        const response = await apiRequest<CategoriesResponse>('/api/categories');
        if (!cancelled) {
          setCategories(response.categories.slice(0, 10));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load categories.');
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, [mode]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    async function loadBlogs() {
      try {
        setLoadingBlogs(true);
        setError(null);

        const response = await loadAllBlogs({
          category: mode === 'category' ? categorySlug : activeCategory === 'all' ? undefined : activeCategory,
          search: mode === 'all' ? searchTerm : undefined,
        });

        if (!cancelled) {
          setBlogs(response);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load blogs.');
        }
      } finally {
        if (!cancelled) {
          setLoadingBlogs(false);
        }
      }
    }

    void loadBlogs();

    return () => {
      cancelled = true;
    };
  }, [activeCategory, categorySlug, mode, searchTerm]);

  const displayedCategories = categories.length ? categories : [];
  const categoryTitle = mode === 'category'
    ? categoryLabel || displayedCategories.find((item) => item.slug === categorySlug)?.name || 'Category archive'
    : 'All blogs';
  const categoryDescription = mode === 'category'
    ? 'Every published story in this category, filtered directly from the Aperture API.'
    : 'Browse all published Aperture articles, filter by category, and search by title as you type.';

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="rounded-[20px] border border-rule bg-paper px-4 py-6 shadow-[0_20px_70px_rgba(27,40,69,0.08)] sm:rounded-[32px] sm:px-6 sm:py-8 md:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {mode === 'category' ? 'Category archive' : 'Public blog listing'}
            </p>
            <h1 className="mt-3 font-display text-[26px] font-normal leading-[1.15] tracking-[-0.04em] sm:mt-4 sm:text-4xl md:text-6xl">
              {categoryTitle}
            </h1>
            <p className="mt-3 max-w-3xl font-serif text-[15px] leading-7 text-muted sm:mt-4 sm:text-lg sm:leading-8">
              {categoryDescription}
            </p>
          </div>

          <Link
            href="/"
            className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent sm:mt-0 sm:w-auto"
          >
            Back home
          </Link>
        </div>

        {/* Category pills + inline search bar on the same row */}
        {mode === 'all' ? (
          <div className="mt-8">
            <div className="flex items-center gap-3">
              {/* Scrollable category pills — takes remaining space */}
              <div className="min-w-0 flex-1 overflow-x-auto pb-1">
                <div className="flex min-w-max items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      activeCategory === 'all'
                        ? 'border-accent bg-accent text-paper shadow-[0_6px_16px_rgba(184,96,64,0.2)]'
                        : 'border-rule bg-bg text-ink hover:border-accent hover:bg-paper'
                    }`}
                  >
                    All
                  </button>

                  {loadingCategories ? (
                    <span className="rounded-full border border-rule bg-bg px-3 py-1.5 text-xs text-muted">
                      Loading…
                    </span>
                  ) : (
                    displayedCategories.map((item) => {
                      const active = activeCategory === item.slug;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveCategory(item.slug)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                            active
                              ? 'border-accent bg-accent text-paper shadow-[0_6px_16px_rgba(184,96,64,0.2)]'
                              : 'border-rule bg-bg text-ink hover:border-accent hover:bg-paper'
                          }`}
                        >
                          {item.name}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Compact inline search bar — fixed width on right */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 rounded-full border border-rule bg-bg px-3 py-1.5 shadow-[0_4px_12px_rgba(27,40,69,0.04)] transition focus-within:border-accent focus-within:shadow-[0_4px_16px_rgba(184,96,64,0.12)]">
                  {/* Search icon */}
                  <svg
                    className="h-3.5 w-3.5 flex-shrink-0 text-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="search"
                    id="blog-search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search…"
                    className="w-32 bg-transparent font-serif text-xs text-ink outline-none placeholder:text-muted sm:w-40"
                    aria-label="Search blogs by title"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="flex-shrink-0 text-muted transition hover:text-ink"
                      aria-label="Clear search"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Active category label */}
            {activeCategory !== 'all' && (
              <p className="mt-3 font-sans text-xs text-muted">
                Showing: <span className="font-semibold text-accent">
                  {displayedCategories.find((c) => c.slug === activeCategory)?.name || activeCategory}
                </span>
                {searchTerm && <> · Search: "<span className="font-semibold text-ink">{searchTerm}</span>"</>}
              </p>
            )}
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="mt-6 rounded-[24px] border border-accent/20 bg-accent/8 px-5 py-4 text-sm text-accent">{error}</div>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loadingBlogs ? (
          <div className="md:col-span-2 xl:col-span-3 rounded-[28px] border border-dashed border-rule bg-paper px-6 py-16 text-center text-muted">
            Loading blogs...
          </div>
        ) : blogs.length ? (
          blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        ) : (
          <div className="md:col-span-2 xl:col-span-3 rounded-[28px] border border-dashed border-rule bg-paper px-6 py-16 text-center text-muted">
            No published blogs match your filters.
          </div>
        )}
      </div>
    </section>
  );
}
