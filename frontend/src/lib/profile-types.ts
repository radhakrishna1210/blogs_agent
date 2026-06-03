import type { PublicBlog } from './blog-types';
import type { AuthUser } from '../context/auth-context';

export type ProfileActivity = {
  joinedAt: string;
  totalLikes: number;
};

export type ProfileResponse = {
  ok: true;
  user: AuthUser & { created_at: string };
  activity: ProfileActivity;
  likedBlogs: Array<PublicBlog & { liked_at: string | null }>;
};
