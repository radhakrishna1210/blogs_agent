import type { Metadata } from 'next';
import { Footer } from '../../components/footer';
import { Navbar } from '../../components/navbar';
import { PublicBlogBrowser } from '../../components/public-blog-browser';
import { topics } from '../../lib/topics';

export const metadata: Metadata = {
  title: 'All Articles | Aperture',
  description: 'Browse every published article on Aperture — filter by category or search by title.',
  alternates: { canonical: 'https://blogs.mannmate.com/blogs' },
  openGraph: {
    title: 'All Articles | Aperture',
    description: 'Browse every published article on Aperture — filter by category or search by title.',
    url: 'https://blogs.mannmate.com/blogs',
    type: 'website',
  },
};

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <Navbar topics={topics} />
      <PublicBlogBrowser mode="all" />
      <Footer />
    </main>
  );
}
