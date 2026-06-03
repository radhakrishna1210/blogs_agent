import Link from 'next/link';
import { topics } from '../lib/topics';

export function Footer() {
  return (
    <footer className="mt-8 border-t border-rule bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="font-display text-3xl tracking-[-0.02em] text-ink">Aperture</div>
          <p className="mt-4 max-w-md font-serif text-[15px] leading-7 text-muted">
            A warm editorial blog system for essays about AI, business, design, culture, and the future of the web.
          </p>
        </div>

        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted">Topics</p>
          <div className="mt-4 grid gap-2">
            {topics.slice(0, 5).map((topic) => (
              <Link key={topic.slug} href={`/category/${topic.slug}`} className="text-sm text-ink hover:text-accent">
                {topic.title}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted">Connect</p>
          <div className="mt-4 grid gap-2 text-sm text-ink">
            <span>Backend: Express API</span>
            <span>Frontend: Next.js + Tailwind</span>
            <span>Palette: ink, accent, bg</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
