import { Footer } from '../components/footer';
import { Hero } from '../components/hero';
import { Navbar } from '../components/navbar';
import { BlogCard } from '../components/blog-card';
import { TopicGrid } from '../components/topic-grid';
import { topics } from '../lib/topics';
import { apiRequest } from '../lib/api';
import type { PublicBlog } from '../lib/blog-types';
import Link from 'next/link';

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

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 border-b border-rule pb-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pb-5">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Topics</p>
            <h2 className="mt-1.5 font-display text-2xl font-normal tracking-[-0.02em] sm:mt-2 sm:text-3xl md:text-5xl">
              Where Aperture publishes
            </h2>
          </div>
          <p className="max-w-md font-serif text-sm leading-6 text-muted">
            Explore our categories — new articles are published daily across AI, finance, health, and more.
          </p>
        </div>

        <TopicGrid />
      </section>

      {latestBlogs.length > 0 && (
        <section id="featured" className="mx-auto max-w-7xl px-4 py-4 pb-10 sm:px-6 sm:pb-16 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 border-b border-rule pb-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pb-5">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Latest</p>
              <h2 className="mt-1.5 font-display text-2xl font-normal tracking-[-0.02em] sm:mt-2 sm:text-3xl md:text-5xl">
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
