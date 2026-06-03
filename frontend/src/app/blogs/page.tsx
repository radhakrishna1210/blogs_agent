import { Footer } from '../../components/footer';
import { Navbar } from '../../components/navbar';
import { PublicBlogBrowser } from '../../components/public-blog-browser';
import { topics } from '../../lib/topics';

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <Navbar topics={topics} />
      <PublicBlogBrowser mode="all" />
      <Footer />
    </main>
  );
}
