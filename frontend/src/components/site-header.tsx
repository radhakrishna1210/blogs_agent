import Link from 'next/link';
import type { Topic } from '../lib/topics';

type SiteHeaderProps = {
  topics: Topic[];
};

export function SiteHeader({ topics }: SiteHeaderProps) {
  const primaryTopics = topics.slice(0, 5);

  return (
    <header className="sticky top-0 z-20 border-b border-rule/90 bg-bg/90 backdrop-blur-xl">
      <div className="border-b border-rule/70 px-4 py-2 text-[11px] tracking-[0.08em] text-muted sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <span>Vol. II · Aperture editorial system</span>
          <span className="hidden md:inline">Warm palette · React design · ready for backend wiring</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:px-8">
        <div className="flex justify-center lg:justify-start">
          <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-paper text-lg font-display text-accent shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] sm:h-10 sm:w-10 sm:text-xl">
                A
              </span>
              <span className="text-left">
                <span className="block font-display text-2xl leading-none tracking-[-0.03em] sm:text-3xl">Aperture</span>
              <span className="block text-xs text-muted">A publication of essays</span>
            </span>
          </Link>
        </div>

        <nav className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:justify-center">
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

        <div className="flex justify-center lg:justify-end">
          <Link
            href="#topics"
            className="inline-flex w-full items-center justify-center rounded-full border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent sm:w-auto"
          >
            Explore topics
          </Link>
        </div>
      </div>
    </header>
  );
}
