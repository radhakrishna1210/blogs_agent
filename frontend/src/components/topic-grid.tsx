import Link from 'next/link';
import { topics } from '../lib/topics';

export function TopicGrid() {
  return (
    <div id="topics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {topics.map((topic) => (
        <Link
          key={topic.slug}
          href={`/category/${topic.slug}`}
          className="group rounded-[22px] border border-rule bg-paper p-6 transition hover:-translate-y-1 hover:border-accent hover:shadow-[0_16px_40px_rgba(27,40,69,0.08)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {topic.count} stories planned
              </p>
              <h3 className="mt-2 font-display text-2xl font-normal tracking-[-0.02em] text-ink">
                {topic.title}
              </h3>
            </div>
            <span className="mt-1 inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: topic.accent }} />
          </div>

          <p className="mt-4 font-serif text-[15px] leading-7 text-muted">
            {topic.summary}
          </p>

          <div className="mt-5 flex items-center justify-between text-xs text-muted">
            <span>Editor: {topic.editor}</span>
            <span className="font-medium text-accent group-hover:translate-x-0.5 transition">Open section →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
