"use client";

import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

export default function EmailSubscriptionModal() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check local storage so we don't spam users who already subscribed or dismissed it
    const hasPrompted = localStorage.getItem('aperture_subscribed') || localStorage.getItem('aperture_newsletter_dismissed');
    if (hasPrompted) return;

    // Show popup after 10 seconds of active browsing
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('aperture_newsletter_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await apiRequest('/api/subscribers', {
        method: 'POST',
        body: { email: email.trim() },
      });
      setSuccess(true);
      localStorage.setItem('aperture_subscribed', 'true');
      
      // Auto close after 2 seconds on success
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassmorphic Backdrop */}
      <div 
        className="absolute inset-0 bg-ink/30 backdrop-blur-md transition-opacity duration-500 animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-[32px] border border-rule bg-paper/95 p-8 shadow-[0_30px_80px_rgba(27,40,69,0.15)] backdrop-blur-xl transition-all duration-300 animate-slide-up">
        {/* Subtle top light gradient beam */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-accent via-ink to-accent" />
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-rule bg-bg text-muted transition hover:border-accent hover:text-ink"
          aria-label="Close newsletter popup"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mt-4 text-center">
          <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            Newsletter
          </span>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.03em] text-ink">
            Aperture Insights
          </h2>
          <p className="mt-3 font-serif text-base leading-6 text-muted">
            Thoughtful essays on design, architecture, and technology, delivered straight to your inbox weekly.
          </p>
        </div>

        {/* Content/Form */}
        <div className="mt-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-4 text-center animate-scale-up">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 font-sans text-sm font-semibold text-ink">You’re subscribed!</h3>
              <p className="mt-1 text-xs text-muted">Thank you for joining our community.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-[20px] border border-rule bg-bg px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent"
                  aria-label="Email address for newsletter"
                />
              </div>

              {error && (
                <p className="text-xs text-accent text-center bg-accent/8 py-2 px-3 rounded-xl border border-accent/20 animate-shake">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group relative flex w-full items-center justify-center gap-2 rounded-full border border-ink bg-ink px-6 py-3.5 text-sm font-medium text-paper transition duration-300 hover:border-accent hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Subscribing...
                  </span>
                ) : (
                  <>
                    Subscribe to newsletter
                    <svg 
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-[10px] text-muted">
          No spam, unsubscribe anytime. Read our privacy policy.
        </p>
      </div>
    </div>
  );
}
