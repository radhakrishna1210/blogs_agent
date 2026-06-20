import Link from 'next/link';
import { topics } from '../lib/topics';

export function TopicGrid() {
  return (
    <div id="topics" className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {topics.map((topic) => (
        <Link
          key={topic.slug}
          href={`/category/${topic.slug}`}
          className="group rounded-[16px] border border-rule bg-paper p-4 transition hover:-translate-y-1 hover:border-accent hover:shadow-[0_16px_40px_rgba(27,40,69,0.08)] sm:rounded-[22px] sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {topic.count} stories planned
              </p>
              <h3 className="mt-1.5 font-display text-lg font-normal tracking-[-0.02em] text-ink sm:mt-2 sm:text-2xl">
                {topic.title}
              </h3>
            </div>
            <span className="mt-1 inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: topic.accent }} />
          </div>

          <p className="mt-3 font-serif text-[13px] leading-6 text-muted sm:mt-4 sm:text-[15px] sm:leading-7 line-clamp-2">
            {topic.summary}
          </p>

          <div className="mt-4 flex items-center justify-between text-[11px] text-muted sm:mt-5 sm:text-xs">
            <span>Editor: {topic.editor}</span>
            <span className="font-medium text-accent group-hover:translate-x-0.5 transition">Open section →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
