import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '../../../components/footer';
import { Navbar } from '../../../components/navbar';
import { BlogArticlePage } from '../../../components/blog-article-page';
import type { BlogsResponse, PublicBlog } from '../../../lib/blog-types';
import { topics } from '../../../lib/topics';

const SITE_URL = 'https://blogs.mannmate.com';

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// cache() dedupes the fetch between generateMetadata and the page render
const getBlog = cache(async (slug: string): Promise<PublicBlog | null> => {
  try {
    const response = await fetchJson<{ ok: true; blog: PublicBlog }>(`/api/blogs/${encodeURIComponent(slug)}`);
    return response.blog;
  } catch {
    return null;
  }
});

/** Plain-text description from summary, falling back to stripped content. */
function blogDescription(blog: PublicBlog): string {
  const source = blog.summary?.trim() || blog.content.replace(/<[^>]+>/g, ' ').replace(/[#*_>`\[\]()]/g, ' ');
  return source.replace(/\s+/g, ' ').trim().slice(0, 160);
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: 'Article not found' };

  const url = `${SITE_URL}/blog/${blog.slug}`;
  const description = blogDescription(blog);

  return {
    title: blog.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: blog.title,
      description,
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      authors: blog.author?.name ? [blog.author.name] : undefined,
      ...(blog.cover_image_url ? { images: [{ url: blog.cover_image_url }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      ...(blog.cover_image_url ? { images: [blog.cover_image_url] } : {}),
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const resolvedParams = await params;

  const blog = await getBlog(resolvedParams.slug);

  if (!blog) {
    notFound();
  }

  let relatedBlogs: PublicBlog[] = [];

  if (blog.category?.slug) {
    try {
      const response = await fetchJson<BlogsResponse>(`/api/blogs?category=${encodeURIComponent(blog.category.slug)}&limit=6&page=1`);
      relatedBlogs = response.blogs.filter((item) => item.slug !== blog?.slug).slice(0, 3);
    } catch {
      relatedBlogs = [];
    }
  }

  return (
    <>
      <main className="min-h-screen bg-bg text-ink">
        <Navbar topics={topics} />
        <BlogArticlePage blog={blog} relatedBlogs={relatedBlogs} />
        <Footer />
      </main>
    </>
  );
}
