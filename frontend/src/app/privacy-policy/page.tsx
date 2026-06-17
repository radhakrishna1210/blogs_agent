import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer';
import { topics } from '../../lib/topics';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Aperture',
  description: 'Privacy Policy for Aperture — how we collect, use, and protect your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <Navbar topics={topics} />

      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <header className="mb-12 border-b border-rule pb-8">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Legal</p>
          <h1 className="mt-3 font-display text-4xl font-normal tracking-[-0.02em] md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 font-serif text-sm text-muted">Last updated: June 2026</p>
        </header>

        <div className="prose-aperture font-serif text-[17px] leading-8 text-ink space-y-8">

          <section>
            <h2 className="font-display text-2xl font-normal tracking-[-0.01em] mb-4">Who we are</h2>
            <p>
              Aperture is an editorial blog published at <strong>blogs.mannmate.com</strong>. We publish essays
              on AI, business, design, culture, and the future of the web. If you have questions about this
              policy, contact us at <a href="mailto:contact@mannmate.com" className="text-accent hover:underline">contact@mannmate.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-normal tracking-[-0.01em] mb-4">What information we collect</h2>
            <p>We collect only what's necessary to run the site:</p>
            <ul className="mt-3 space-y-2 list-disc pl-6 text-[16px]">
              <li><strong>Email address</strong> — if you subscribe to our newsletter. We use this only to send you new articles.</li>
              <li><strong>Google account info</strong> — if you sign in with Google (name, email, profile picture). Used only for authentication.</li>
              <li><strong>Usage data</strong> — pages visited, time on site, browser type. Collected anonymously via Google Analytics (if enabled).</li>
              <li><strong>Cookies</strong> — used by Google AdSense to serve relevant ads, and by Google Sign-In for authentication.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-normal tracking-[-0.01em] mb-4">How we use your information</h2>
            <ul className="mt-3 space-y-2 list-disc pl-6 text-[16px]">
              <li>To send newsletter emails to subscribers (email address only)</li>
              <li>To authenticate you when you sign in</li>
              <li>To show relevant advertisements via Google AdSense</li>
              <li>To understand how readers use the site so we can improve it</li>
            </ul>
            <p className="mt-4">We do not sell, rent, or share your personal information with third parties for their marketing purposes.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-normal tracking-[-0.01em] mb-4">Google AdSense and advertising</h2>
            <p>
              We use Google AdSense to display advertisements on this site. Google uses cookies to serve ads
              based on your prior visits to this and other websites. You can opt out of personalised advertising
              by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Ads Settings</a>.
            </p>
            <p className="mt-4">
              Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to
              this website or other websites. Google's use of advertising cookies enables it and its partners to
              serve ads based on your visit to our site and other sites on the internet.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-normal tracking-[-0.01em] mb-4">Cookies</h2>
            <p>
              Cookies are small files stored on your device. We use them for:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-6 text-[16px]">
              <li><strong>Authentication</strong> — keeping you signed in via Google</li>
              <li><strong>Advertising</strong> — Google AdSense uses cookies to personalise ads</li>
            </ul>
            <p className="mt-4">
              You can disable cookies in your browser settings. Doing so may affect how some features of the
              site work.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-normal tracking-[-0.01em] mb-4">Data retention</h2>
            <p>
              We retain your email address for as long as you are subscribed to our newsletter. You can
              unsubscribe at any time using the link in any email we send. Account data from Google Sign-In
              is retained until you request deletion.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-normal tracking-[-0.01em] mb-4">Your rights</h2>
            <p>You have the right to:</p>
            <ul className="mt-3 space-y-2 list-disc pl-6 text-[16px]">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Unsubscribe from our newsletter at any time</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, email us at <a href="mailto:contact@mannmate.com" className="text-accent hover:underline">contact@mannmate.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-normal tracking-[-0.01em] mb-4">Changes to this policy</h2>
            <p>
              We may update this policy occasionally. When we do, the "Last updated" date at the top of this
              page will change. We encourage you to review this page periodically.
            </p>
          </section>

        </div>
      </article>

      <Footer />
    </main>
  );
}
