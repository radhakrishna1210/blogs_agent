import Link from 'next/link';
import type { Topic } from '../lib/topics';
import { AuthButton } from './auth-button';

type NavbarProps = {
  topics: Topic[];
};

export function Navbar({ topics }: NavbarProps) {
  const primaryTopics = topics.slice(0, 5);

  return (
    <header className="sticky top-0 z-20 border-b border-rule/90 bg-bg/90 backdrop-blur-xl">
      <div className="border-b border-rule/70 px-6 py-2 text-[11px] tracking-[0.08em] text-muted lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <span>Vol. II · Aperture editorial system</span>
          <span>Warm palette · React design · ready for backend wiring</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-paper text-xl font-display text-accent shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
              A
            </span>
            <span>
              <span className="block font-display text-3xl leading-none tracking-[-0.03em]">Aperture</span>
              <span className="block text-xs text-muted">A publication of essays</span>
            </span>
          </Link>
        </div>

        <nav className="flex flex-wrap justify-start gap-3 lg:justify-center">
          <Link
            href="/blogs"
            className="rounded-full border border-accent bg-accent px-4 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:opacity-95"
          >
            Blogs
          </Link>
          {primaryTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/category/${topic.slug}`}
              className="rounded-full border border-rule px-4 py-2 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent hover:bg-paper"
            >
              {topic.title}
            </Link>
          ))}
        </nav>

        <div className="flex justify-start lg:justify-end">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
