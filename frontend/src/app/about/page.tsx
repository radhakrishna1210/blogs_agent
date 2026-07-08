import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer';
import { topics } from '../../lib/topics';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'What Aperture is, who publishes it, and how we approach the articles we write.',
  alternates: { canonical: 'https://blogs.mannmate.com/about' },
  openGraph: { url: 'https://blogs.mannmate.com/about' },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <Navbar topics={topics} />

      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <header className="mb-12 border-b border-rule pb-8">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">About</p>
          <h1 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] md:text-5xl">
            About Aperture
          </h1>
          <p className="mt-4 font-serif text-lg leading-8 text-muted">
            Practical writing on technology, money, work, and modern life.
          </p>
        </header>

        <div className="font-serif text-[16px] leading-8 text-muted space-y-6">
          <p>
            Aperture is an editorial publication by <strong className="text-ink">MannMate</strong>. We write
            articles and guides on AI and technology, personal finance, productivity, health and wellness,
            careers, startups, design, science, culture, and travel — the subjects that shape everyday
            decisions.
          </p>

          <h2 className="font-display text-2xl font-normal tracking-[-0.01em] text-ink pt-2">How we write</h2>
          <p>
            Every article is researched, edited, and reviewed before it is published. We aim for pieces that
            answer a real question a reader arrived with — clearly, without padding, and with enough depth to
            act on. Where a topic touches health or money, we stick to well-established guidance and encourage
            readers to consult qualified professionals for personal decisions.
          </p>

          <h2 className="font-display text-2xl font-normal tracking-[-0.01em] text-ink pt-2">Who is behind it</h2>
          <p>
            Aperture is published by the team behind{' '}
            <a href="https://mannmate.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              MannMate
            </a>
            , a mental-health support platform built in India. The blog is editorially independent from the
            platform: it exists to publish useful, general-interest writing.
          </p>

          <h2 className="font-display text-2xl font-normal tracking-[-0.01em] text-ink pt-2">Advertising</h2>
          <p>
            Aperture is supported by advertising served through Google AdSense. Ads never influence what we
            write or how we rank the subjects we cover. You can read more in our{' '}
            <a href="/privacy-policy" className="text-accent hover:underline">privacy policy</a>.
          </p>

          <h2 className="font-display text-2xl font-normal tracking-[-0.01em] text-ink pt-2">Get in touch</h2>
          <p>
            Corrections, story ideas, or partnership enquiries — see our{' '}
            <a href="/contact" className="text-accent hover:underline">contact page</a>. We aim to respond
            within two business days.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
