import { notFound } from 'next/navigation';
import { Footer } from '../../../components/footer';
import { Navbar } from '../../../components/navbar';
import { BlogArticlePage } from '../../../components/blog-article-page';
import type { BlogsResponse, PublicBlog } from '../../../lib/blog-types';
import { topics } from '../../../lib/topics';

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

export default async function BlogPage({ params }: BlogPageProps) {
  const resolvedParams = await params;

  let blog: PublicBlog | null = null;

  try {
    const response = await fetchJson<{ ok: true; blog: PublicBlog }>(`/api/blogs/${resolvedParams.slug}`);
    blog = response.blog;
  } catch {
    blog = null;
  }

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
