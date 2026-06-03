"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/auth-context';
import { apiRequest } from '../../../lib/api';
import type {
  AdminCategoriesResponse,
  AdminCategory,
  AdminGenerateBlogResponse,
  AdminPublishBlogResponse,
} from '../../../lib/admin-types';

function copyToClipboard(value: string) {
  void navigator.clipboard.writeText(value);
}

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />;
}

function normalizeGeneratedContent(content: string) {
  return String(content || '').trim();
}

export default function AdminGenerateBlogPage() {
  const { token, isReady } = useAuth();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [prompt, setPrompt] = useState('Write a polished Aperture article about thoughtful product design, clear editorial flow, and warm brand systems.');
  const [category, setCategory] = useState('');
  const [result, setResult] = useState<AdminGenerateBlogResponse | null>(null);
  const [editableTitle, setEditableTitle] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let cancelled = false;

    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        const response = await apiRequest<AdminCategoriesResponse>('/api/categories');
        if (!cancelled) {
          setCategories(response.categories);
          setCategory((currentCategory) => currentCategory || response.categories[0]?.slug || response.categories[0]?.id || '');
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load categories.');
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, [isReady]);

  async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest<AdminGenerateBlogResponse>('/api/admin/generate-blog', {
        method: 'POST',
        token,
        body: {
          prompt,
          category,
        },
      });
      setResult(response);
      setEditableTitle(response.blog.title);
      setEditableContent(normalizeGeneratedContent(response.blog.content));
      setEditing(false);
      setPublishSuccess(null);
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : 'Failed to generate blog.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    if (!token || !result) {
      return;
    }

    try {
      setPublishing(true);
      setError(null);
      const response = await apiRequest<AdminPublishBlogResponse>('/api/blogs', {
        method: 'POST',
        token,
        body: {
          title: editableTitle.trim(),
          content: editableContent.trim(),
          category,
          summary: result.blog.summary,
          ai_generated: true,
        },
      });

      setPublishSuccess(`Published ${response.blog.title} to the blog database.`);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : 'Failed to publish blog.');
    } finally {
      setPublishing(false);
    }
  }

  function renderHtmlContent(content: string) {
    return { __html: content };
  }

  const previewCategory = categories.find((item) => item.slug === category) || null;

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-rule bg-paper px-6 py-8 shadow-[0_20px_70px_rgba(27,40,69,0.08)] md:px-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Generate blog</p>
        <h1 className="mt-4 font-display text-4xl font-normal tracking-[-0.04em] md:text-6xl">Groq-assisted blog draft</h1>
        <p className="mt-4 max-w-3xl font-serif text-lg leading-8 text-muted">
          Create a structured draft, let Groq humanize it, and review the final version before publishing it to Aperture.
        </p>
      </div>

      {error ? <div className="rounded-[24px] border border-accent/30 bg-accent/8 px-5 py-4 text-sm text-accent">{error}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleGenerate} className="space-y-5 rounded-[32px] border border-rule bg-paper p-6 shadow-[0_14px_50px_rgba(27,40,69,0.06)] md:p-8">
          <div>
            <label className="block text-sm font-medium text-ink" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-rule bg-bg px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
            >
              {categoriesLoading ? <option value="">Loading categories...</option> : null}
              {!categoriesLoading && !categories.length ? <option value="">No categories available</option> : null}
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink" htmlFor="prompt">
              Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={10}
              className="mt-2 w-full rounded-[24px] border border-rule bg-bg px-4 py-4 text-sm leading-7 text-ink outline-none transition placeholder:text-muted focus:border-accent"
              placeholder="Describe the article you want Groq to generate."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !category || categoriesLoading}
            className="inline-flex items-center justify-center rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                Generating...
              </span>
            ) : (
              'Generate blog'
            )}
          </button>
        </form>

        <div className="space-y-5 rounded-[32px] border border-rule bg-paper p-6 shadow-[0_14px_50px_rgba(27,40,69,0.06)] md:p-8">
          <div className="rounded-[24px] border border-rule bg-bg p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Selected category</p>
            <p className="mt-2 font-serif text-2xl text-ink">
              {previewCategory?.name || 'None selected'}
            </p>
          </div>

          <div className="rounded-[24px] border border-rule bg-bg p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Note</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              The backend returns both the raw draft and the humanized version so you can compare tone before inserting it into blogs.
            </p>
          </div>

          {publishSuccess ? (
            <div className="rounded-[24px] border border-accent/20 bg-accent/8 px-5 py-4 text-sm text-accent">
              {publishSuccess}
            </div>
          ) : null}

          {result ? (
            <div className="space-y-4 rounded-[24px] border border-accent/20 bg-paper p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Generated title</p>
                {editing ? (
                  <input
                    value={editableTitle}
                    onChange={(event) => setEditableTitle(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-rule bg-bg px-4 py-3 font-serif text-2xl text-ink outline-none transition focus:border-accent"
                    aria-label="Editable blog title"
                  />
                ) : (
                  <p className="mt-2 font-serif text-2xl text-ink">{editableTitle || result.blog.title}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Summary</p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(result.blog.content)}
                    className="text-xs font-semibold uppercase tracking-[0.16em] text-accent transition hover:text-ink"
                  >
                    Copy content
                  </button>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{result.blog.summary}</p>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Full content</p>
                  <button
                    type="button"
                    onClick={() => setEditing((current) => !current)}
                    className="rounded-full border border-rule px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-accent hover:bg-bg"
                  >
                    {editing ? 'Done editing' : 'Edit'}
                  </button>
                </div>

                {editing ? (
                  <textarea
                    value={editableContent}
                    onChange={(event) => setEditableContent(event.target.value)}
                    rows={14}
                    className="mt-3 w-full rounded-[20px] border border-rule bg-bg px-4 py-4 text-sm leading-7 text-ink outline-none transition placeholder:text-muted focus:border-accent"
                    placeholder="Edit the HTML content before publishing."
                  />
                ) : null}

                <div className="mt-3 max-h-[360px] overflow-auto rounded-[20px] border border-rule bg-bg p-5 text-sm leading-7 text-ink">
                  <article
                    className="space-y-4 [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-normal [&_h1]:tracking-[-0.03em] [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-normal [&_h2]:tracking-[-0.03em] [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-ink [&_p]:text-sm [&_p]:leading-7 [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic"
                    dangerouslySetInnerHTML={renderHtmlContent(editing ? editableContent : normalizeGeneratedContent(result.blog.content))}
                  />
                </div>
              </div>

              <div className="rounded-[20px] border border-rule bg-bg p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Cover image idea</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {result.blog.suggested_cover_image_description || 'No cover suggestion was returned.'}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void handlePublish()}
                  disabled={publishing || !editableTitle.trim() || !editableContent.trim()}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {publishing ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner />
                      Publishing...
                    </span>
                  ) : (
                    'Publish'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setEditing((current) => !current)}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-rule bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:border-accent hover:bg-bg"
                >
                  {editing ? 'Lock draft' : 'Edit'}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-rule bg-bg px-6 py-12 text-center text-muted">
              Enter a prompt and generate a draft to preview the title, summary, and HTML content.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
