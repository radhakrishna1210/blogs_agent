import Image from 'next/image';
import Link from 'next/link';
import type { PublicBlog } from '../lib/blog-types';

type BlogCardProps = {
  blog: PublicBlog;
};

function getFallbackLabel(blog: PublicBlog) {
  return blog.category?.name?.slice(0, 2).toUpperCase() || blog.title.slice(0, 2).toUpperCase();
}

function getGradient(blog: PublicBlog) {
  const slug = blog.category?.slug || blog.slug;
  const colors = [
    'linear-gradient(135deg, rgba(184,96,64,0.92), rgba(90,122,110,0.84))',
    'linear-gradient(135deg, rgba(27,40,69,0.95), rgba(184,96,64,0.75))',
    'linear-gradient(135deg, rgba(90,122,110,0.95), rgba(251,247,236,0.6))',
    'linear-gradient(135deg, rgba(122,90,142,0.9), rgba(184,96,64,0.72))',
  ];

  let hash = 0;
  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash * 31 + slug.charCodeAt(index)) % colors.length;
  }

  return colors[hash];
}

export function BlogCard({ blog }: BlogCardProps) {
  const authorName = blog.author?.name || 'Aperture Editorial';
  const categoryName = blog.category?.name || 'Uncategorized';

  return (
    <article className="overflow-hidden rounded-[28px] border border-rule bg-paper shadow-[0_14px_45px_rgba(27,40,69,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(27,40,69,0.1)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-soft">
        {blog.cover_image_url ? (
          <Image
            src={blog.cover_image_url}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-end justify-between p-5" style={{ background: getGradient(blog) }}>
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-2 font-display text-lg tracking-[0.08em] text-white backdrop-blur-sm">
              {getFallbackLabel(blog)}
            </span>
            <span className="max-w-[60%] text-right text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
              Aperture story
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/35 to-transparent" />
        <div className="absolute left-5 top-5 inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
          {categoryName}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <h3 className="font-display text-3xl font-normal tracking-[-0.03em] text-ink">
          {blog.title}
        </h3>

        <p className="font-serif text-[15px] leading-7 text-muted">
          {blog.summary || 'No summary available yet.'}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4 text-sm text-muted">
          <span>{authorName}</span>
          <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.12em] text-muted">
            <span>{blog.read_time || 1} min read</span>
            <span>{blog.likes_count} likes</span>
          </div>
        </div>

        {blog.category ? (
          <Link
            href={`/category/${blog.category.slug}`}
            className="inline-flex items-center rounded-full border border-rule px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-accent hover:bg-bg"
          >
            Browse category
          </Link>
        ) : null}

        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center rounded-full border border-accent bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:opacity-95"
        >
          Read article
        </Link>
      </div>
    </article>
  );
}
