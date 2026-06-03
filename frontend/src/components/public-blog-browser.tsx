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
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="rounded-[32px] border border-rule bg-paper px-6 py-8 shadow-[0_20px_70px_rgba(27,40,69,0.08)] md:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {mode === 'category' ? 'Category archive' : 'Public blog listing'}
            </p>
            <h1 className="mt-4 font-display text-4xl font-normal tracking-[-0.04em] md:text-6xl">
              {categoryTitle}
            </h1>
            <p className="mt-4 max-w-3xl font-serif text-lg leading-8 text-muted">
              {categoryDescription}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent"
          >
            Back home
          </Link>
        </div>

        {mode === 'all' ? (
          <div className="mt-8 space-y-4">
            <div className="overflow-x-auto pb-2">
              <div className="flex min-w-max items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    activeCategory === 'all'
                      ? 'border-accent bg-accent text-paper shadow-[0_10px_24px_rgba(184,96,64,0.18)]'
                      : 'border-rule bg-bg text-ink hover:border-accent hover:bg-paper'
                  }`}
                >
                  All categories
                </button>

                {loadingCategories ? (
                  <span className="rounded-full border border-rule bg-bg px-4 py-2 text-sm text-muted">Loading categories...</span>
                ) : (
                  displayedCategories.map((item) => {
                    const active = activeCategory === item.slug;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveCategory(item.slug)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          active
                            ? 'border-accent bg-accent text-paper shadow-[0_10px_24px_rgba(184,96,64,0.18)]'
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

            <div className="rounded-[24px] border border-rule bg-bg px-4 py-3 shadow-[0_10px_28px_rgba(27,40,69,0.04)]">
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by title..."
                className="w-full bg-transparent font-serif text-lg text-ink outline-none placeholder:text-muted"
                aria-label="Search blogs by title"
              />
            </div>
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
