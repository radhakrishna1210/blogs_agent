"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../context/auth-context';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

function ToolbarButton({
  onClick,
  title,
  children,
  active,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`min-w-[32px] px-2.5 py-1.5 text-sm rounded-lg transition select-none ${
        active
          ? 'bg-accent text-paper font-semibold'
          : 'hover:bg-bg text-ink'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-rule mx-0.5 shrink-0" />;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const { token } = useAuth();
  const editorRef = useRef<HTMLDivElement>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleModalDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleModalDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await uploadInModal(file);
      }
    }
  };

  const handleModalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadInModal(e.target.files[0]);
    }
  };

  const uploadInModal = async (file: File) => {
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

      setImageUrl(resData.url);
      if (!imageAlt) {
        setImageAlt(file.name);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const uploadAndInsertImage = async (file: File) => {
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

      // Focus and restore selection
      editorRef.current?.focus();
      restoreSelection(savedSelection);

      const img = `<img src="${resData.url}" alt="${file.name}" style="max-width:100%;border-radius:12px;margin:12px 0;" />`;
      document.execCommand('insertHTML', false, img);
      emit();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleEditorDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        saveSelection();
        await uploadAndInsertImage(file);
      }
    }
  };

  const handleEditorDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const emit = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const format = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    emit();
  };

  const handleInput = () => emit();

  // Keep editorRef in sync with value only on mount / external reset
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedSelection(sel.getRangeAt(0).cloneRange());
    }
  };

  const restoreSelection = (range: Range | null) => {
    if (!range) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const openImageModal = () => {
    saveSelection();
    setImageUrl('');
    setImageAlt('');
    setShowImageModal(true);
  };

  const insertImage = () => {
    if (!imageUrl.trim()) {
      setShowImageModal(false);
      return;
    }
    editorRef.current?.focus();
    restoreSelection(savedSelection);
    const img = `<img src="${imageUrl.trim()}" alt="${imageAlt.trim()}" style="max-width:100%;border-radius:12px;margin:12px 0;" />`;
    document.execCommand('insertHTML', false, img);
    emit();
    setShowImageModal(false);
  };

  return (
    <div className="rounded-[24px] border border-rule bg-bg overflow-hidden transition focus-within:border-accent">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-rule bg-paper px-3 py-2">
        {/* Text style */}
        <ToolbarButton onClick={() => format('bold')} title="Bold"><strong>B</strong></ToolbarButton>
        <ToolbarButton onClick={() => format('italic')} title="Italic"><em>I</em></ToolbarButton>
        <ToolbarButton onClick={() => format('underline')} title="Underline"><span className="underline">U</span></ToolbarButton>
        <ToolbarButton onClick={() => format('strikeThrough')} title="Strikethrough"><span className="line-through">S</span></ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton onClick={() => format('formatBlock', 'H1')} title="Heading 1">H1</ToolbarButton>
        <ToolbarButton onClick={() => format('formatBlock', 'H2')} title="Heading 2">H2</ToolbarButton>
        <ToolbarButton onClick={() => format('formatBlock', 'H3')} title="Heading 3">H3</ToolbarButton>
        <ToolbarButton onClick={() => format('formatBlock', 'P')} title="Paragraph">P</ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton onClick={() => format('insertUnorderedList')} title="Bullet list">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => format('insertOrderedList')} title="Numbered list">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10H6"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton onClick={() => format('justifyLeft')} title="Align left">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => format('justifyCenter')} title="Align center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => format('justifyRight')} title="Align right">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
        </ToolbarButton>

        <Divider />

        {/* Blockquote */}
        <ToolbarButton onClick={() => format('formatBlock', 'BLOCKQUOTE')} title="Blockquote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
        </ToolbarButton>

        {/* Horizontal Rule */}
        <ToolbarButton onClick={() => { format('insertHorizontalRule'); }} title="Horizontal rule">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/></svg>
        </ToolbarButton>

        <Divider />

        {/* Image insert */}
        <ToolbarButton onClick={openImageModal} title="Insert image">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </ToolbarButton>

        <Divider />

        {/* Undo / Redo */}
        <ToolbarButton onClick={() => format('undo')} title="Undo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => format('redo')} title="Redo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>
        </ToolbarButton>
      </div>

      {/* Editable content area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onDrop={handleEditorDrop}
        onDragOver={handleEditorDragOver}
        suppressContentEditableWarning
        className="p-5 min-h-[320px] outline-none text-ink font-serif text-lg leading-8
          [&_h1]:font-display [&_h1]:text-4xl [&_h1]:font-normal [&_h1]:tracking-[-0.03em] [&_h1]:mb-4
          [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-normal [&_h2]:tracking-[-0.02em] [&_h2]:mb-3
          [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:mb-2
          [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
          [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted [&_blockquote]:mb-4
          [&_hr]:border-rule [&_hr]:my-4
          [&_img]:rounded-[12px] [&_img]:max-w-full"
        data-placeholder="Start writing your blog post..."
      />

      {/* Image Insert Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-rule bg-paper p-7 shadow-[0_30px_80px_rgba(27,40,69,0.18)]">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Insert image</p>
            <h2 className="mt-2 font-display text-2xl tracking-[-0.03em] text-ink">Add an image to your post</h2>

            <div className="mt-5 space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleModalDrag}
                onDragOver={handleModalDrag}
                onDragLeave={handleModalDrag}
                onDrop={handleModalDrop}
                className={`relative flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed p-5 transition ${
                  dragActive
                    ? 'border-accent bg-accent/5'
                    : 'border-rule bg-bg hover:border-accent/40'
                }`}
              >
                <input
                  type="file"
                  id="modalImageUpload"
                  accept="image/*"
                  onChange={handleModalFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2 text-muted">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="text-xs">Uploading...</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-xl block mb-1">📸</span>
                    <p className="text-xs font-semibold text-ink">Drag & drop image here</p>
                    <p className="text-[10px] text-muted">or click to choose file</p>
                  </div>
                )}
              </div>

              <div className="text-center text-xs text-muted font-medium">— OR —</div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1" htmlFor="img-url">Paste Image URL</label>
                <input
                  id="img-url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-2xl border border-rule bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1" htmlFor="img-alt">Alt text (accessibility)</label>
                <input
                  id="img-alt"
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full rounded-2xl border border-rule bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent"
                  placeholder="Describe the image"
                />
              </div>

              {imageUrl && (
                <div className="rounded-2xl border border-rule bg-bg p-3 overflow-hidden relative">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted mb-2">Preview</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={imageAlt} className="max-w-full rounded-xl max-h-40 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <button
                    type="button"
                    onClick={() => { setImageUrl(''); setImageAlt(''); }}
                    className="absolute top-2 right-2 rounded-full bg-ink/80 text-white p-1 text-[10px] hover:bg-ink transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={insertImage}
                disabled={!imageUrl.trim()}
                className="flex-1 inline-flex items-center justify-center rounded-full border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                Insert
              </button>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="flex-1 inline-flex items-center justify-center rounded-full border border-rule bg-paper px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-bg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
