import type { Metadata } from 'next';
import { Footer } from '../../../components/footer';
import { Navbar } from '../../../components/navbar';
import { PublicBlogBrowser } from '../../../components/public-blog-browser';
import { topics } from '../../../lib/topics';

const SITE_URL = 'https://blogs.mannmate.com';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) return { title: 'Category' };

  const url = `${SITE_URL}/category/${topic.slug}`;

  return {
    title: `${topic.title} — Articles & Guides`,
    description: topic.summary,
    alternates: { canonical: url },
    openGraph: { url, title: topic.title, description: topic.summary },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;

  return (
    <main className="min-h-screen bg-bg text-ink">
      <Navbar topics={topics} />
      <PublicBlogBrowser mode="category" categorySlug={resolvedParams.slug} />
      <Footer />
    </main>
  );
}
