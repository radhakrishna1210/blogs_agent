import { Footer } from '../../../components/footer';
import { Navbar } from '../../../components/navbar';
import { PublicBlogBrowser } from '../../../components/public-blog-browser';
import { topics } from '../../../lib/topics';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

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
