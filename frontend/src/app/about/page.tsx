import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '../../components/footer';
import { Navbar } from '../../components/navbar';
import { topics } from '../../lib/topics';

export const metadata: Metadata = {
  title: 'About | Aperture',
  description: 'Learn about Aperture — our editorial mission, how we use AI in our publishing process, and how to get in touch.',
  alternates: { canonical: 'https://blogs.mannmate.com/about' },
  openGraph: {
    title: 'About | Aperture',
    description: 'Learn about Aperture — our editorial mission, how we use AI in our publishing process, and how to get in touch.',
    url: 'https://blogs.mannmate.com/about',
    type: 'website',
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Aperture',
  url: 'https://blogs.mannmate.com/about',
  publisher: {
    '@type': 'Organization',
    name: 'Aperture',
    url: 'https://blogs.mannmate.com',
    contactPoint: {
      '@type': 'ContactPoint',
      url: 'https://blogs.mannmate.com/contact',
      contactType: 'editorial',
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <main className="min-h-screen bg-bg text-ink">
        <Navbar topics={topics} />

        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:px-8 md:py-20">
          <div className="overflow-hidden rounded-[32px] border border-rule bg-paper shadow-[0_20px_70px_rgba(27,40,69,0.08)]">
            <div className="px-6 py-10 sm:px-10 md:px-14 md:py-14">

              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                About
              </p>
              <h1 className="mt-4 font-display text-5xl font-normal tracking-[-0.04em] md:text-7xl">
                Aperture
              </h1>
              <p className="mt-6 max-w-2xl font-serif text-xl leading-9 text-muted">
                A warm editorial blog covering AI, personal finance, productivity, health,
                startups, careers, design, and the future of the web.
              </p>

              <div className="mt-12 space-y-10 border-t border-rule pt-10">

                <section>
                  <h2 className="font-display text-3xl font-normal tracking-[-0.03em]">Our mission</h2>
                  <p className="mt-4 font-serif text-[17px] leading-8 text-muted">
                    Aperture publishes original, well-researched essays that help readers make better
                    decisions — about money, work, health, and technology. We believe good writing
                    should be accessible without being shallow, and opinionated without being
                    careless.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-3xl font-normal tracking-[-0.03em]">How we use AI</h2>
                  <p className="mt-4 font-serif text-[17px] leading-8 text-muted">
                    Aperture uses AI tools to assist with research, drafting, and editorial
                    consistency. Every published article is reviewed for accuracy, originality, and
                    editorial quality before going live. We do not publish AI output without
                    human review. Where AI has assisted substantially in drafting, articles are
                    labelled as AI-assisted.
                  </p>
                  <p className="mt-4 font-serif text-[17px] leading-8 text-muted">
                    Our goal is to use AI to publish more useful content faster — not to replace
                    the editorial judgement that makes an article worth reading.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-3xl font-normal tracking-[-0.03em]">Advertising</h2>
                  <p className="mt-4 font-serif text-[17px] leading-8 text-muted">
                    Aperture is supported by Google AdSense advertising. Ads are clearly separated
                    from editorial content. We never accept payment in exchange for positive
                    editorial coverage. Our{' '}
                    <Link href="/privacy-policy" className="text-accent hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    explains how advertising cookies work and your choices.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-3xl font-normal tracking-[-0.03em]">Get in touch</h2>
                  <p className="mt-4 font-serif text-[17px] leading-8 text-muted">
                    For editorial enquiries, corrections, or partnership requests, use our{' '}
                    <Link href="/contact" className="text-accent hover:underline">
                      contact form
                    </Link>
                    . We read every message and aim to respond within two business days.
                  </p>
                </section>

              </div>
            </div>
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
