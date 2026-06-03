export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  created_at?: string;
  updated_at?: string;
};

export type AdminAuthor = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
};

export type AdminBlog = {
  id: string;
  title: string;
  slug: string;
  category: AdminCategory | null;
  cover_image_url: string | null;
  summary: string | null;
  content: string;
  author_id: string;
  author: AdminAuthor | null;
  status: string;
  ai_generated: boolean;
  read_time: number | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
};

export type AdminDashboardResponse = {
  ok: true;
  stats: {
    totalBlogs: number;
    totalUsers: number;
    totalLikes: number;
  };
  recentBlogs: AdminBlog[];
};

export type AdminBlogsResponse = {
  ok: true;
  count: number;
  blogs: AdminBlog[];
};

export type AdminCategoriesResponse = {
  ok: true;
  count: number;
  categories: AdminCategory[];
};

export type AdminGeneratedBlog = {
  title: string;
  summary: string;
  content: string;
  suggested_cover_image_description?: string;
};

export type AdminGenerateBlogResponse = {
  ok: true;
  category: AdminCategory;
  blog: AdminGeneratedBlog;
  draft: AdminGeneratedBlog;
  note: string;
};

export type AdminPublishBlogResponse = {
  ok: true;
  blog: AdminBlog;
};
