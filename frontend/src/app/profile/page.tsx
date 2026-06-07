"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { apiRequest } from '../../lib/api';
import type { ProfileResponse } from '../../lib/profile-types';
import { BlogCard } from '../../components/blog-card';

type ProfileTab = 'liked' | 'activity';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-5 py-3 text-sm font-medium transition ${
        active
          ? 'border-accent bg-accent text-paper shadow-[0_10px_24px_rgba(184,96,64,0.18)]'
          : 'border-rule bg-paper text-ink hover:border-accent hover:bg-bg'
      }`}
    >
      {children}
    </button>
  );
}

export default function ProfilePage() {
  const { user: authUser, token, isReady } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('liked');

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!authUser || !token) {
      router.replace('/login');
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        const response = await apiRequest<ProfileResponse>('/api/me/profile', { token });
        if (!cancelled) {
          setProfile(response);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load profile.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [authUser, isReady, router, token]);

  const user = profile?.user || authUser;
  const joinedAt = profile?.activity.joinedAt || user?.created_at || null;
  const totalLikes = profile?.activity.totalLikes ?? 0;

  const userInitial = useMemo(() => {
    return user?.name?.slice(0, 1).toUpperCase() || 'A';
  }, [user]);

  return (
    <main className="min-h-screen bg-bg px-6 py-12 text-ink lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[32px] border border-rule bg-paper p-8 shadow-[0_20px_80px_rgba(27,40,69,0.08)] md:p-12">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Profile</p>
          <h1 className="mt-4 font-display text-4xl font-normal tracking-[-0.03em] md:text-6xl">Your Aperture account</h1>

          {!isReady || loading ? (
            <p className="mt-6 font-serif text-lg text-muted">Loading account details...</p>
          ) : user ? (
            <div className="mt-8 grid gap-6 rounded-[28px] border border-rule bg-bg p-6 md:grid-cols-[auto_1fr] md:items-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-rule bg-soft text-2xl font-semibold text-ink">
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  userInitial
                )}
              </div>
              <div>
                <div className="space-y-2 font-serif text-lg text-muted">
                  <p><span className="font-semibold text-ink">Name:</span> {user.name}</p>
                  <p><span className="font-semibold text-ink">Email:</span> {user.email}</p>
                  <p><span className="font-semibold text-ink">Role:</span> <span className="capitalize">{user.role}</span></p>
                </div>
                {user.role === 'admin' && (
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:opacity-95 shadow-[0_10px_24px_rgba(184,96,64,0.18)]"
                    >
                      Go to Admin Dashboard ↗
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-[24px] border border-accent/20 bg-accent/8 px-5 py-4 text-sm text-accent">
              {error}
            </div>
          ) : null}
        </section>

        {user ? (
          <section className="rounded-[32px] border border-rule bg-paper p-6 shadow-[0_20px_80px_rgba(27,40,69,0.08)] md:p-8">
            <div className="flex flex-wrap items-center gap-3 border-b border-rule pb-5">
              <TabButton active={activeTab === 'liked'} onClick={() => setActiveTab('liked')}>
                Liked Blogs
              </TabButton>
              <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>
                My Activity
              </TabButton>
            </div>

            {activeTab === 'liked' ? (
              <div className="mt-6 space-y-6">
                <div className="flex items-end justify-between gap-4 border-b border-rule pb-4">
                  <div>
                    <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">Liked blogs</p>
                    <h2 className="mt-2 font-display text-3xl font-normal tracking-[-0.03em]">All blogs you liked</h2>
                  </div>
                  <p className="text-sm text-muted">{totalLikes} liked {totalLikes === 1 ? 'post' : 'posts'}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {profile?.likedBlogs?.length ? (
                    profile.likedBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
                  ) : (
                    <div className="md:col-span-2 xl:col-span-3 rounded-[28px] border border-dashed border-rule bg-bg px-6 py-16 text-center text-muted">
                      You have not liked any blogs yet.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-[28px] border border-rule bg-bg p-6 shadow-[0_12px_36px_rgba(27,40,69,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Joined</p>
                  <p className="mt-4 font-display text-4xl font-normal tracking-[-0.04em] text-ink">
                    {joinedAt ? formatDate(joinedAt) : 'Unknown'}
                  </p>
                  <p className="mt-3 font-serif text-sm leading-6 text-muted">
                    The date your Aperture account first appeared in the system.
                  </p>
                </div>

                <div className="rounded-[28px] border border-rule bg-bg p-6 shadow-[0_12px_36px_rgba(27,40,69,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Total likes</p>
                  <p className="mt-4 font-display text-4xl font-normal tracking-[-0.04em] text-ink">{totalLikes}</p>
                  <p className="mt-3 font-serif text-sm leading-6 text-muted">
                    The number of blogs you have liked across Aperture.
                  </p>
                </div>
              </div>
            )}
          </section>
        ) : (
          <div className="rounded-[28px] border border-dashed border-rule bg-paper px-6 py-12 text-center text-muted">
            You are not logged in.
            <Link
              href="/login"
              className="mt-6 inline-flex items-center rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:border-accent hover:bg-accent"
            >
              Continue with Google
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
