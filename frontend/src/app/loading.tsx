export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 text-ink">
      <div className="rounded-[28px] border border-rule bg-paper px-8 py-10 text-center shadow-[0_20px_80px_rgba(27,40,69,0.08)]">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="mt-4 font-display text-3xl font-normal tracking-[-0.03em]">Loading Aperture...</p>
        <p className="mt-2 font-serif text-sm text-muted">Preparing the warm editorial experience.</p>
      </div>
    </main>
  );
}
