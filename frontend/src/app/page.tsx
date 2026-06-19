import type { Metadata } from 'next';
import { Footer } from '../components/footer';
import { Hero } from '../components/hero';
import { Navbar } from '../components/navbar';
import { BlogCard } from '../components/blog-card';
import { TopicGrid } from '../components/topic-grid';
import { topics } from '../lib/topics';
import { apiRequest } from '../lib/api';
import type { PublicBlog } from '../lib/blog-types';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aperture — Editorial blog on AI, Finance, Productivity & More',
  description: 'Aperture publishes original essays on AI, personal finance, productivity, health, startups, and the future of the web.',
  alternates: { canonical: 'https://blogs.mannmate.com' },
  openGraph: {
    title: 'Aperture — Editorial blog on AI, Finance, Productivity & More',
    description: 'Aperture publishes original essays on AI, personal finance, productivity, health, startups, and the future of the web.',
    url: 'https://blogs.mannmate.com',
    type: 'website',
  },
};

async function getLatestBlogs(): Promise<PublicBlog[]> {
  try {
    const data = await apiRequest<{ blogs: PublicBlog[] }>('/api/blogs?limit=3', {});
    return data.blogs || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const latestBlogs = await getLatestBlogs();

  return (
    <main className="min-h-screen bg-bg text-ink">
      <Navbar topics={topics} />

      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6 border-b border-rule pb-5">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Topics</p>
            <h2 className="mt-2 font-display text-3xl font-normal tracking-[-0.02em] md:text-5xl">
              Where Aperture publishes
            </h2>
          </div>
          <p className="max-w-md font-serif text-sm leading-6 text-muted md:text-base">
            Explore our categories — new articles are published daily across AI, finance, health, and more.
          </p>
        </div>

        <TopicGrid />
      </section>

      {latestBlogs.length > 0 && (
        <section id="featured" className="mx-auto max-w-7xl px-6 py-4 pb-16 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-6 border-b border-rule pb-5">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Latest</p>
              <h2 className="mt-2 font-display text-3xl font-normal tracking-[-0.02em] md:text-5xl">
                Recent articles
              </h2>
            </div>
            <Link href="/blogs" className="font-serif text-sm text-accent hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {latestBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
