import Link from 'next/link';

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="grid gap-10 overflow-hidden rounded-[28px] border border-rule bg-paper p-8 shadow-[0_20px_80px_rgba(27,40,69,0.08)] lg:grid-cols-[1.4fr_0.9fr] lg:p-12">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            A publication of essays
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-normal tracking-[-0.035em] text-ink md:text-7xl">
            Ideas worth reading, published daily.
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-lg leading-8 text-muted md:text-xl">
            Aperture covers AI, personal finance, health, design, and the future of work — with fresh articles every morning written for curious minds.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/blogs" className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:opacity-95">
              Read all articles
            </Link>
            <Link href="#topics" className="rounded-full border border-rule px-5 py-3 text-sm font-medium text-ink transition hover:border-accent hover:bg-bg">
              Browse topics
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[24px] border border-rule bg-bg p-6">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent2">
              What we cover
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {[
                ['AI & Tech', 'Tools & automation'],
                ['Finance', 'Money that works'],
                ['Health', 'Mind and body'],
                ['Careers', 'Work on your terms'],
              ].map(([name, desc]) => (
                <div key={name} className="rounded-2xl border border-rule bg-paper p-4">
                  <div className="font-sans text-[11px] uppercase tracking-[0.16em] text-muted">{name}</div>
                  <div className="mt-2 font-serif text-xs text-ink">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-ink p-5 text-paper">
            <div className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-paper/60">Published daily</div>
            <p className="mt-2 font-serif text-lg leading-7 text-paper/90">
              New articles every morning across all categories — no filler, no fluff.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
