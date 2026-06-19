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
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchBlog(slug: string): Promise<PublicBlog | null> {
  try {
    const response = await fetchJson<{ ok: true; blog: PublicBlog }>(`/api/blogs/${slug}`);
    return response.blog;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlog(slug);

  if (!blog) {
    return { title: 'Post not found | Aperture' };
  }

  const title = `${blog.title} | Aperture`;
  const description = blog.summary || blog.title;
  const canonicalUrl = `${SITE_URL}/blog/${blog.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      authors: blog.author?.name ? [blog.author.name] : undefined,
      images: blog.cover_image_url
        ? [{ url: blog.cover_image_url, alt: blog.title }]
        : [{ url: `${SITE_URL}/og-default.png`, alt: 'Aperture' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: blog.cover_image_url ? [blog.cover_image_url] : undefined,
    },
  };
}

function BlogJsonLd({ blog }: { blog: PublicBlog }) {
  const postUrl = `${SITE_URL}/blog/${blog.slug}`;

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      ...(blog.category
        ? [{ '@type': 'ListItem', position: 2, name: blog.category.name, item: `${SITE_URL}/category/${blog.category.slug}` }]
        : []),
      { '@type': 'ListItem', position: blog.category ? 3 : 2, name: blog.title, item: postUrl },
    ],
  };

  const blogPosting = {
    '@type': 'BlogPosting',
    '@id': postUrl,
    headline: blog.title,
    description: blog.summary || blog.title,
    url: postUrl,
    datePublished: blog.created_at,
    dateModified: blog.updated_at,
    author: blog.author
      ? { '@type': 'Person', name: blog.author.name }
      : { '@type': 'Organization', name: 'Aperture Editorial', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Aperture',
      url: SITE_URL,
    },
    ...(blog.cover_image_url
      ? { image: { '@type': 'ImageObject', url: blog.cover_image_url } }
      : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    inLanguage: 'en-US',
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [blogPosting, breadcrumb],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;

  const blog = await fetchBlog(slug);

  if (!blog) {
    notFound();
  }

  let relatedBlogs: PublicBlog[] = [];

  if (blog.category?.slug) {
    try {
      const response = await fetchJson<BlogsResponse>(
        `/api/blogs?category=${encodeURIComponent(blog.category.slug)}&limit=6&page=1`
      );
      relatedBlogs = response.blogs.filter((item) => item.slug !== blog.slug).slice(0, 3);
    } catch {
      relatedBlogs = [];
    }
  }

  return (
    <>
      <BlogJsonLd blog={blog} />
      <main className="min-h-screen bg-bg text-ink">
        <Navbar topics={topics} />
        <BlogArticlePage blog={blog} relatedBlogs={relatedBlogs} />
        <Footer />
      </main>
    </>
  );
}
