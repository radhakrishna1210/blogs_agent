import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 text-ink">
      <div className="max-w-xl rounded-[28px] border border-rule bg-paper px-8 py-10 text-center shadow-[0_20px_80px_rgba(27,40,69,0.08)]">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">404</p>
        <h1 className="mt-4 font-display text-4xl font-normal tracking-[-0.03em]">Page not found</h1>
        <p className="mt-4 font-serif text-lg leading-8 text-muted">
          The page you are looking for does not exist in the Aperture editorial system.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
