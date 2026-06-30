import { Footer } from '../components/footer';
import { Hero } from '../components/hero';
import { Navbar } from '../components/navbar';
import { BlogCard } from '../components/blog-card';
import { TopicGrid } from '../components/topic-grid';
import { topics } from '../lib/topics';
import { apiRequest } from '../lib/api';
import type { PublicBlog, BlogsResponse, CategoriesResponse, PublicBlogCategory } from '../lib/blog-types';
import Link from 'next/link';

async function getLatestBlogs(): Promise<PublicBlog[]> {
  try {
    const data = await apiRequest<{ blogs: PublicBlog[] }>('/api/blogs?limit=3', {}, { cache: 'no-store' });
    return data.blogs || [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<PublicBlogCategory[]> {
  try {
    const data = await apiRequest<CategoriesResponse>('/api/categories', {}, { cache: 'no-store' });
    return data.categories || [];
  } catch {
    return [];
  }
}

async function getBlogsByCategory(categorySlug: string): Promise<PublicBlog[]> {
  try {
    const data = await apiRequest<BlogsResponse>(
      `/api/blogs?category=${encodeURIComponent(categorySlug)}&limit=3`,
      {},
      { cache: 'no-store' }
    );
    return data.blogs || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [latestBlogs, categories] = await Promise.all([
    getLatestBlogs(),
    getCategories(),
  ]);

  // Fetch blogs for top 3 categories in parallel
  const topCategories = categories.slice(0, 3);
  const categoryBlogsResults = await Promise.all(
    topCategories.map((cat) => getBlogsByCategory(cat.slug))
  );
  const categoryBlogs = topCategories.map((cat, i) => ({
    category: cat,
    blogs: categoryBlogsResults[i],
  })).filter((item) => item.blogs.length > 0);

  return (
    <main className="min-h-screen bg-bg text-ink">
      <Navbar topics={topics} />

      <Hero />

      {/* Topics / Categories Grid */}
      <section id="topics" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
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

      {/* Latest Blogs (newest first) */}
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

      {/* Category-wise Segregation */}
      {categoryBlogs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-4 pb-12 sm:px-6 sm:pb-20 lg:px-8">
          <div className="mb-8 border-b border-rule pb-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Browse by category</p>
            <h2 className="mt-1.5 font-display text-2xl font-normal tracking-[-0.02em] sm:mt-2 sm:text-3xl md:text-5xl">
              Stories by topic
            </h2>
          </div>

          <div className="space-y-14">
            {categoryBlogs.map(({ category, blogs }) => (
              <div key={category.id}>
                {/* Category heading */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/12 text-xs font-semibold text-accent">
                      {category.icon || '•'}
                    </span>
                    <h3 className="font-display text-xl font-normal tracking-[-0.02em] sm:text-2xl">
                      {category.name}
                    </h3>
                  </div>
                  <Link
                    href={`/category/${category.slug}`}
                    className="font-serif text-xs text-accent transition hover:underline sm:text-sm"
                  >
                    View all →
                  </Link>
                </div>

                {/* Blog cards for this category */}
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-7 py-3 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent"
            >
              Browse all articles →
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
