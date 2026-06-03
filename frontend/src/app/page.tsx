import { Footer } from '../components/footer';
import { Hero } from '../components/hero';
import { Navbar } from '../components/navbar';
import { StoryCard } from '../components/story-card';
import { TopicGrid } from '../components/topic-grid';
import { featuredStories, topics } from '../lib/topics';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <Navbar topics={topics} />

      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6 border-b border-rule pb-5">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Topics</p>
            <h2 className="mt-2 font-display text-3xl font-normal tracking-[-0.02em] md:text-5xl">
              Where Aperture publishes
            </h2>
          </div>
          <p className="max-w-md font-serif text-sm leading-6 text-muted md:text-base">
            A tidy category map for the blog system, designed so the frontend can grow into a real editorial product later.
          </p>
        </div>

        <TopicGrid />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredStories.map((story) => (
            <StoryCard key={story.title} story={story} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
