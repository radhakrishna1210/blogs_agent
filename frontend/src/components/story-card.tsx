import type { Story } from '../lib/topics';

type StoryCardProps = {
  story: Story;
};

export function StoryCard({ story }: StoryCardProps) {
  return (
    <article id="featured" className="rounded-[24px] border border-rule bg-paper p-6 shadow-[0_12px_36px_rgba(27,40,69,0.05)]">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: story.accent }} />
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{story.topic}</p>
      </div>

      <h3 className="font-display text-3xl font-normal tracking-[-0.02em] text-ink">
        {story.title}
      </h3>

      <p className="mt-4 font-serif text-[15px] leading-7 text-muted">
        {story.summary}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-rule pt-4 text-sm text-muted">
        <span>{story.author}</span>
        <span className="font-mono text-xs">{story.readTime}</span>
      </div>
    </article>
  );
}
