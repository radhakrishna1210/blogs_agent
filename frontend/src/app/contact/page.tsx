import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer';
import { topics } from '../../lib/topics';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Aperture',
  description: "Get in touch with the Aperture team. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <Navbar topics={topics} />

      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <header className="mb-12 border-b border-rule pb-8">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Get in touch</p>
          <h1 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] md:text-5xl">
            Contact
          </h1>
          <p className="mt-4 font-serif text-lg leading-8 text-muted">
            Questions, feedback, or partnership enquiries — we read every message.
          </p>
        </header>

        <div className="grid gap-12 md:grid-cols-2">

          <div className="space-y-8">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted mb-3">General enquiries</p>
              <a href="mailto:contact@mannmate.com" className="font-serif text-lg text-accent hover:underline">
                contact@mannmate.com
              </a>
            </div>

            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted mb-3">Advertising</p>
              <a href="mailto:ads@mannmate.com" className="font-serif text-lg text-accent hover:underline">
                ads@mannmate.com
              </a>
            </div>

            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted mb-3">Privacy & data requests</p>
              <a href="mailto:privacy@mannmate.com" className="font-serif text-lg text-accent hover:underline">
                privacy@mannmate.com
              </a>
            </div>

            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted mb-3">Website</p>
              <a href="https://mannmate.com" target="_blank" rel="noopener noreferrer" className="font-serif text-lg text-accent hover:underline">
                mannmate.com
              </a>
            </div>
          </div>

          <div className="font-serif text-[16px] leading-8 text-muted space-y-5">
            <p>
              Aperture is a publication by <strong className="text-ink">MannMate</strong>, covering AI, business,
              design, culture, and the future of the web.
            </p>
            <p>
              We publish daily essays written to perform well in search, featured snippets, and AI assistant
              responses. If you'd like to collaborate or advertise, reach out — we're open to it.
            </p>
            <p>
              We aim to respond within 2 business days.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
