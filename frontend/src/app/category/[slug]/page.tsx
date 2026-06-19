import type { Metadata } from 'next';
import { Footer } from '../../../components/footer';
import { Navbar } from '../../../components/navbar';
import { PublicBlogBrowser } from '../../../components/public-blog-browser';
import type { BlogsResponse, PublicBlog } from '../../../lib/blog-types';
import { topics } from '../../../lib/topics';

const SITE_URL = 'https://blogs.mannmate.com';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
}

async function fetchCategoryBlogs(slug: string): Promise<PublicBlog[]> {
  const pageSize = 24;
  let page = 1;
  let totalPages = 1;
  const blogs: PublicBlog[] = [];

  try {
    do {
      const res = await fetch(
        `${getBackendBaseUrl()}/api/blogs?category=${encodeURIComponent(slug)}&page=${page}&limit=${pageSize}`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) break;
      const data = await res.json() as BlogsResponse;
      blogs.push(...data.blogs);
      totalPages = data.totalPages || 1;
      page += 1;
    } while (page <= totalPages);
  } catch {
    return blogs;
  }

  return blogs;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = topics.find((t) => t.slug === slug);
  const name = topic?.title || slug.replace(/-/g, ' ');
  const description = topic?.summary || `Browse all ${name} articles on Aperture.`;
  const canonicalUrl = `${SITE_URL}/category/${slug}`;

  return {
    title: `${name} | Aperture`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${name} | Aperture`,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const topic = topics.find((t) => t.slug === slug);
  const categoryLabel = topic?.title;

  const initialBlogs = await fetchCategoryBlogs(slug);

  return (
    <main className="min-h-screen bg-bg text-ink">
      <Navbar topics={topics} />
      <PublicBlogBrowser
        mode="category"
        categorySlug={slug}
        categoryLabel={categoryLabel}
        initialBlogs={initialBlogs}
      />
      <Footer />
    </main>
  );
}
