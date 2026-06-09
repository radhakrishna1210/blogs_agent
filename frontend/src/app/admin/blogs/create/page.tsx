"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/auth-context';
import { apiRequest } from '../../../../lib/api';
import RichTextEditor from '../../../../components/RichTextEditor';
import type {
  AdminCategoriesResponse,
  AdminCategory,
  AdminPublishBlogResponse,
} from '../../../../lib/admin-types';

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
  );
}

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-[0_12px_40px_rgba(27,40,69,0.14)] text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'border-accent/30 bg-paper text-ink'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {toast.type === 'success' ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-accent text-xs">✓</span>
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs">!</span>
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="ml-2 opacity-50 hover:opacity-100 transition text-xs"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

function ValidationBadge({ message }: { message: string }) {
  return (
    <p className="mt-1.5 text-xs text-red-500 font-medium">{message}</p>
  );
}

let toastCounter = 0;

export default function AdminCreateBlogPage() {
  const router = useRouter();
  const { token, isReady } = useAuth();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!token) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Upload failed');
      }

      setCoverImageUrl(resData.url);
      addToast('Cover image uploaded successfully!', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to upload image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Validation
  const [touched, setTouched] = useState({ title: false, content: false, category: false });

  // Submission state
  const [publishing, setPublishing] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;

    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        const response = await apiRequest<AdminCategoriesResponse>('/api/categories');
        if (!cancelled) {
          setCategories(response.categories);
          if (response.categories.length > 0) {
            setCategory(response.categories[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          addToast(err instanceof Error ? err.message : 'Failed to load categories.', 'error');
        }
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    }

    void loadCategories();
    return () => { cancelled = true; };
  }, [isReady, addToast]);

  // Validation helpers
  const titleError = touched.title && !title.trim() ? 'Title is required.' : null;
  const contentError = touched.content && !content.trim() ? 'Content cannot be empty.' : null;
  const categoryError = touched.category && !category ? 'Please select a category.' : null;
  const isFormValid = title.trim() && content.trim() && category;

  async function submitBlog(status: 'published' | 'draft') {
    // Mark all as touched to reveal validation errors
    setTouched({ title: true, content: true, category: true });
    if (!isFormValid || !token) return;

    const isPublishing = status === 'published';
    if (isPublishing) setPublishing(true);
    else setSavingDraft(true);

    try {
      const response = await apiRequest<AdminPublishBlogResponse>('/api/blogs', {
        method: 'POST',
        token,
        body: {
          title: title.trim(),
          summary: summary.trim() || undefined,
          content: content.trim(),
          category,
          cover_image_url: coverImageUrl.trim() || undefined,
          ai_generated: false,
          status,
        },
      });

      if (isPublishing) {
        addToast(`"${response.blog.title}" published successfully!`, 'success');
        setTimeout(() => router.push('/admin/blogs'), 1500);
      } else {
        addToast(`"${response.blog.title}" saved as draft.`, 'success');
        setTimeout(() => router.push('/admin/blogs'), 1500);
      }
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Something went wrong.', 'error');
      if (isPublishing) setPublishing(false);
      else setSavingDraft(false);
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitBlog('published');
  };

  const handleSaveDraft = () => {
    void submitBlog('draft');
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <section className="space-y-8">
        {/* Header */}
        <div className="rounded-[32px] border border-rule bg-paper px-6 py-8 shadow-[0_20px_70px_rgba(27,40,69,0.08)] md:px-10">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Create blog</p>
          <h1 className="mt-4 font-display text-4xl font-normal tracking-[-0.04em] md:text-6xl">
            Add a new post
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-lg leading-8 text-muted">
            Write a new article from scratch. Publish it immediately or save it as a draft to finish later.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-[32px] border border-rule bg-paper p-6 shadow-[0_14px_50px_rgba(27,40,69,0.06)] md:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Row 1: Title + Category */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-ink" htmlFor="title">
                  Title <span className="text-accent">*</span>
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, title: true }))}
                  className={`mt-2 w-full rounded-2xl border bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent ${
                    titleError ? 'border-red-400' : 'border-rule'
                  }`}
                  placeholder="Blog post title"
                />
                {titleError && <ValidationBadge message={titleError} />}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink" htmlFor="category">
                  Category <span className="text-accent">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, category: true }))}
                  className={`mt-2 w-full rounded-2xl border bg-bg px-4 py-3 text-sm text-ink outline-none transition focus:border-accent ${
                    categoryError ? 'border-red-400' : 'border-rule'
                  }`}
                >
                  {categoriesLoading ? <option value="">Loading categories...</option> : null}
                  {!categoriesLoading && !categories.length ? (
                    <option value="">No categories available</option>
                  ) : null}
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {categoryError && <ValidationBadge message={categoryError} />}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-ink" htmlFor="summary">
                Summary{' '}
                <span className="text-xs text-muted font-normal">(optional — used for blog cards)</span>
              </label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-[24px] border border-rule bg-bg px-4 py-4 text-sm leading-7 text-ink outline-none transition placeholder:text-muted focus:border-accent"
                placeholder="Brief excerpt for the blog card preview."
              />
            </div>

            {/* Cover Image Upload & URL */}
            <div>
              <label className="block text-sm font-medium text-ink">
                Cover Image <span className="text-xs text-muted font-normal">(optional — upload from device or paste URL)</span>
              </label>
              <div className="mt-2 grid gap-6 md:grid-cols-[1fr_2fr]">
                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed p-6 transition ${
                    dragActive
                      ? 'border-accent bg-accent/5'
                      : 'border-rule bg-bg hover:border-accent/50'
                  }`}
                >
                  <input
                    type="file"
                    id="coverImageUpload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-muted">
                      <Spinner />
                      <span className="text-xs">Uploading...</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-2xl block mb-2">📸</span>
                      <p className="text-xs font-semibold text-ink">Drag & drop image</p>
                      <p className="text-[10px] text-muted mt-1">or click to browse</p>
                    </div>
                  )}
                </div>

                {/* Paste URL directly */}
                <div className="flex flex-col justify-center">
                  <span className="text-xs text-muted font-medium block mb-2">Or enter image URL manually:</span>
                  <input
                    id="coverImageUrl"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="w-full rounded-2xl border border-rule bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {coverImageUrl && (
                <div className="mt-4 relative rounded-2xl border border-rule bg-bg overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImageUrl}
                    alt="Cover preview"
                    className="w-full object-cover max-h-52"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl('')}
                    className="absolute top-3 right-3 rounded-full bg-ink/80 hover:bg-ink text-white px-3 py-1.5 text-xs transition"
                    title="Remove Image"
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Content <span className="text-accent">*</span>
              </label>
              <div
                onBlur={() => setTouched((t) => ({ ...t, content: true }))}
                className={contentError ? 'ring-2 ring-red-400 rounded-[24px]' : ''}
              >
                <RichTextEditor value={content} onChange={setContent} />
              </div>
              {contentError && <ValidationBadge message={contentError} />}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:justify-end sm:items-center">
              <p className="text-xs text-muted sm:mr-auto">
                Fields marked <span className="text-accent">*</span> are required.
              </p>

              {/* Save as Draft */}
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft || publishing}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-rule bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:border-accent hover:bg-bg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingDraft ? (
                  <>
                    <Spinner />
                    Saving draft...
                  </>
                ) : (
                  'Save as Draft'
                )}
              </button>

              {/* Publish */}
              <button
                type="submit"
                disabled={publishing || savingDraft}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink bg-ink px-8 py-3 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {publishing ? (
                  <>
                    <Spinner />
                    Publishing...
                  </>
                ) : (
                  'Publish Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
