import Link from 'next/link';
import type { Topic } from '../lib/topics';

type SiteHeaderProps = {
  topics: Topic[];
};

export function SiteHeader({ topics }: SiteHeaderProps) {
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
          {primaryTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`#${topic.slug}`}
              className="rounded-full border border-rule px-4 py-2 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent hover:bg-paper"
            >
              {topic.title}
            </Link>
          ))}
        </nav>

        <div className="flex justify-start lg:justify-end">
          <Link
            href="#topics"
            className="inline-flex items-center rounded-full border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent"
          >
            Explore topics
          </Link>
        </div>
      </div>
    </header>
  );
}
