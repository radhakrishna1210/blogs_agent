import Link from 'next/link';

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="grid gap-8 overflow-hidden rounded-[20px] border border-rule bg-paper p-4 shadow-[0_20px_80px_rgba(27,40,69,0.08)] sm:rounded-[28px] sm:gap-10 sm:p-8 lg:grid-cols-[1.4fr_0.9fr] lg:p-12">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            A publication of essays
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[28px] font-normal leading-[1.15] tracking-[-0.035em] text-ink sm:mt-4 sm:text-5xl md:text-7xl">
            Ideas worth reading, published daily.
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-[15px] leading-[1.7] text-muted sm:mt-6 sm:text-lg md:text-xl md:leading-8">
            Aperture covers AI, personal finance, health, design, and the future of work — with fresh articles every morning written for curious minds.
          </p>

          <div className="mt-6 flex gap-3 sm:mt-8">
            <Link href="/blogs" className="flex-1 rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-white transition hover:opacity-95 sm:flex-none">
              Read all articles
            </Link>
            <Link href="#topics" className="flex-1 rounded-full border border-rule px-5 py-3 text-center text-sm font-medium text-ink transition hover:border-accent hover:bg-bg sm:flex-none">
              Browse topics
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[16px] border border-rule bg-bg p-4 sm:rounded-[24px] sm:p-6">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent2">
              What we cover
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:mt-4 sm:gap-3">
              {[
                ['AI & Tech', 'Tools & automation'],
                ['Finance', 'Money that works'],
                ['Health', 'Mind and body'],
                ['Careers', 'Work on your terms'],
              ].map(([name, desc]) => (
                <div key={name} className="rounded-xl border border-rule bg-paper p-3 sm:rounded-2xl sm:p-4">
                  <div className="font-sans text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[11px]">{name}</div>
                  <div className="mt-1.5 font-serif text-[11px] text-ink sm:mt-2 sm:text-xs">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-ink p-4 text-paper sm:mt-6 sm:rounded-2xl sm:p-5">
            <div className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-paper/60">Published daily</div>
            <p className="mt-2 font-serif text-base sm:text-lg leading-7 text-paper/90">
              New articles every morning across all categories — no filler, no fluff.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
