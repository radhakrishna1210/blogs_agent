export type PublicBlogCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
};

export type PublicBlogAuthor = {
  id: string;
  google_id?: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at?: string;
};

export type PublicBlog = {
  id: string;
  title: string;
  slug: string;
  category: PublicBlogCategory | null;
  cover_image_url: string | null;
  summary: string | null;
  content: string;
  author_id: string;
  author: PublicBlogAuthor | null;
  status: string;
  ai_generated: boolean;
  read_time: number | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
};

export type BlogsResponse = {
  ok: true;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  blogs: PublicBlog[];
};

export type CategoriesResponse = {
  ok: true;
  count: number;
  categories: PublicBlogCategory[];
};
