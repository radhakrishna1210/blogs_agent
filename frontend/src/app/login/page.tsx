"use client";

function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
}

export default function LoginPage() {
  const href = `${getBackendBaseUrl()}/auth/google`;

  return (
    <main className="min-h-screen bg-bg px-6 py-12 text-ink lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-2xl items-center justify-center">
        <section className="w-full rounded-[28px] border border-rule bg-paper p-8 shadow-[0_20px_80px_rgba(27,40,69,0.08)] md:p-12">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Login</p>
          <h1 className="mt-4 font-display text-4xl font-normal tracking-[-0.03em] md:text-6xl">
            Continue with Google
          </h1>
          <p className="mt-4 max-w-xl font-serif text-lg leading-8 text-muted">
            Use Google Auth to sign in to Aperture. Your account will be created automatically the first time you log in.
          </p>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => {
                window.location.href = href;
              }}
              className="inline-flex items-center rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent"
            >
              Continue with Google
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
