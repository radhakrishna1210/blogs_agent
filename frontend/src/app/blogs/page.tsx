import type { Metadata } from 'next';
import { Footer } from '../../components/footer';
import { Navbar } from '../../components/navbar';
import { PublicBlogBrowser } from '../../components/public-blog-browser';
import { topics } from '../../lib/topics';

export const metadata: Metadata = {
  title: 'All Articles',
  description: 'Browse every article on Aperture — guides and essays on AI, personal finance, productivity, health, careers, and more.',
  alternates: { canonical: 'https://blogs.mannmate.com/blogs' },
  openGraph: { url: 'https://blogs.mannmate.com/blogs' },
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
