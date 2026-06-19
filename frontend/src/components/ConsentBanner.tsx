"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function updateConsent(granted: boolean) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
  });
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cookie_consent');
      if (!stored) {
        setVisible(true);
      } else {
        updateConsent(stored === 'accepted');
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try { localStorage.setItem('cookie_consent', 'accepted'); } catch { /* ignore */ }
    updateConsent(true);
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem('cookie_consent', 'declined'); } catch { /* ignore */ }
    updateConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-rule bg-paper shadow-[0_-8px_30px_rgba(27,40,69,0.12)]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p className="font-serif text-sm leading-6 text-muted">
          We use cookies to serve personalised ads and analyse traffic. By clicking{' '}
          <strong className="text-ink">Accept</strong>, you consent to our use of cookies for
          advertising and analytics.{' '}
          <Link href="/privacy-policy" className="text-accent underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={decline}
            className="rounded-full border border-rule bg-bg px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
