"use client";

import { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import type { AdminCategoriesResponse, AdminCategory } from '../../../lib/admin-types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setLoading(true);
        const response = await apiRequest<AdminCategoriesResponse>('/api/categories');
        if (!cancelled) {
          setCategories(response.categories);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load categories.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-rule bg-paper px-6 py-8 shadow-[0_20px_70px_rgba(27,40,69,0.08)] md:px-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Categories</p>
        <h1 className="mt-4 font-display text-4xl font-normal tracking-[-0.04em] md:text-6xl">Editorial taxonomy</h1>
        <p className="mt-4 max-w-2xl font-serif text-lg leading-8 text-muted">
          Categories used across Aperture content. Keep these aligned with the blog publishing workflow and AI prompts.
        </p>
      </div>

      {error ? <div className="rounded-[24px] border border-accent/30 bg-accent/8 px-5 py-4 text-sm text-accent">{error}</div> : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-[24px] border border-dashed border-rule bg-paper px-6 py-12 text-center text-muted md:col-span-2 xl:col-span-3">
            Loading categories...
          </div>
        ) : categories.length ? (
          categories.map((item) => (
            <article key={item.id} className="rounded-[28px] border border-rule bg-paper p-6 shadow-[0_14px_50px_rgba(27,40,69,0.06)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{item.slug}</p>
                  <h2 className="mt-3 font-serif text-2xl text-ink">{item.name}</h2>
                </div>
                <span className="rounded-full border border-rule bg-bg px-3 py-1 text-xs font-medium text-muted">
                  {item.icon || '—'}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">{item.description || 'No description provided.'}</p>
            </article>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-rule bg-paper px-6 py-12 text-center text-muted md:col-span-2 xl:col-span-3">
            No categories found.
          </div>
        )}
      </div>
    </section>
  );
}
