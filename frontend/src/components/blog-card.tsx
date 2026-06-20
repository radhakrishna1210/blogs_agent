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
    <article className="overflow-hidden rounded-[20px] border border-rule bg-paper shadow-[0_14px_45px_rgba(27,40,69,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(27,40,69,0.1)] sm:rounded-[28px]">
      <div className="relative aspect-[16/9] overflow-hidden bg-soft sm:aspect-[16/10]">
        {blog.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={blog.cover_image_url} alt={blog.title} className="h-full w-full object-cover" />
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

      <div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
        <h3 className="font-display text-xl font-normal tracking-[-0.03em] text-ink sm:text-3xl">
          {blog.title}
        </h3>

        <p className="font-serif text-[14px] leading-6 text-muted sm:text-[15px] sm:leading-7 line-clamp-3">
          {blog.summary || 'No summary available yet.'}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-3 text-sm text-muted sm:gap-3 sm:pt-4">
          <span className="text-xs sm:text-sm">{authorName}</span>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:gap-4 sm:text-xs">
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
