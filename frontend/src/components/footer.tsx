import Link from 'next/link';
import { topics } from '../lib/topics';

export function Footer() {
  return (
    <footer className="mt-4 border-t border-rule bg-paper sm:mt-6">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        {/* Single compact row: brand + links */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="font-display text-lg tracking-[-0.02em] text-ink">Aperture</span>
            <span className="hidden text-rule sm:inline">·</span>
            <p className="hidden font-serif text-xs text-muted sm:block">
              Essays on AI, business, design &amp; culture.
            </p>
          </div>

          {/* Links row */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink">
            {topics.slice(0, 4).map((topic) => (
              <Link key={topic.slug} href={`/category/${topic.slug}`} className="hover:text-accent transition">
                {topic.title}
              </Link>
            ))}
            <span className="text-rule">·</span>
            <Link href="/blogs" className="hover:text-accent transition">All Articles</Link>
            <Link href="/contact" className="hover:text-accent transition">Contact</Link>
            <Link href="/admin" className="hover:text-accent transition">Admin</Link>
            <Link href="/privacy-policy" className="hover:text-accent transition">Privacy</Link>
          </nav>
        </div>

        {/* Bottom copyright */}
        <div className="mt-3 border-t border-rule/60 pt-3 text-center text-[10px] text-muted sm:text-xs">
          © {new Date().getFullYear()} Aperture. Built with care.
        </div>
      </div>
    </footer>
  );
}
