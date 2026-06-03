-- Aperture Supabase schema
-- Run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- Updated-at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  google_id text not null unique,
  email text not null unique,
  name text not null,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default timezone('utc', now())
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon text,
  description text
);

-- Blogs
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category uuid not null references public.categories(id) on delete restrict,
  cover_image_url text,
  content text not null,
  summary text,
  author_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'published')),
  ai_generated boolean not null default false,
  read_time integer not null default 1 check (read_time > 0),
  likes_count integer not null default 0 check (likes_count >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Likes
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  blog_id uuid not null references public.blogs(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  constraint likes_user_blog_unique unique (user_id, blog_id)
);

-- Helpful indexes
create index if not exists idx_blogs_author_id on public.blogs(author_id);
create index if not exists idx_blogs_category on public.blogs(category);
create index if not exists idx_blogs_status on public.blogs(status);
create index if not exists idx_likes_blog_id on public.likes(blog_id);
create index if not exists idx_likes_user_id on public.likes(user_id);

-- Trigger for updated_at
drop trigger if exists trg_blogs_updated_at on public.blogs;
create trigger trg_blogs_updated_at
before update on public.blogs
for each row
execute function public.set_updated_at();

-- Optional counters are managed in application code.
-- Add your RLS policies after confirming the auth flow.
