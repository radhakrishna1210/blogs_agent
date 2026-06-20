import Link from 'next/link';
import { topics } from '../lib/topics';

export function Footer() {
  return (
    <footer className="mt-6 border-t border-rule bg-paper sm:mt-8">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Brand block */}
        <div className="mb-8">
          <div className="font-display text-2xl tracking-[-0.02em] text-ink sm:text-3xl">Aperture</div>
          <p className="mt-3 max-w-md font-serif text-[14px] leading-6 text-muted sm:mt-4 sm:text-[15px] sm:leading-7">
            A warm editorial blog system for essays about AI, business, design, culture, and the future of the web.
          </p>
        </div>

        {/* Links grid - 2 columns on mobile, expands on desktop */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-muted sm:text-xs">Topics</p>
            <div className="mt-3 grid gap-2 sm:mt-4">
              {topics.slice(0, 5).map((topic) => (
                <Link key={topic.slug} href={`/category/${topic.slug}`} className="text-[13px] text-ink hover:text-accent sm:text-sm">
                  {topic.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-muted sm:text-xs">Explore</p>
            <div className="mt-3 grid gap-2 text-[13px] sm:mt-4 sm:text-sm">
              <Link href="/blogs" className="text-ink hover:text-accent">All Articles</Link>
              <Link href="#topics" className="text-ink hover:text-accent">Browse Topics</Link>
              <Link href="/contact" className="text-ink hover:text-accent">Contact</Link>
              <Link href="/privacy-policy" className="text-ink hover:text-accent">Privacy Policy</Link>
              <Link href="/admin" className="text-ink hover:text-accent">Admin</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-rule pt-6 text-center text-[11px] text-muted sm:text-xs">
          © {new Date().getFullYear()} Aperture. Built with care.
        </div>
      </div>
    </footer>
  );
}
