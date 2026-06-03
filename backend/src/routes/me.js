import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateRequest, requireAuth } from '../middleware/auth.js';

export const meRouter = Router();

async function hydrateBlogs(blogs) {
  const categoryIds = [...new Set(blogs.map((blog) => blog.category).filter(Boolean))];
  const authorIds = [...new Set(blogs.map((blog) => blog.author_id).filter(Boolean))];

  const [categoriesResult, authorsResult] = await Promise.all([
    categoryIds.length
      ? supabase.from('categories').select('id, name, slug, icon, description').in('id', categoryIds)
      : Promise.resolve({ data: [], error: null }),
    authorIds.length
      ? supabase.from('users').select('id, google_id, email, name, avatar_url, role, created_at').in('id', authorIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (categoriesResult.error) {
    throw categoriesResult.error;
  }

  if (authorsResult.error) {
    throw authorsResult.error;
  }

  const categoryMap = new Map((categoriesResult.data || []).map((category) => [category.id, category]));
  const authorMap = new Map((authorsResult.data || []).map((author) => [author.id, author]));

  return blogs.map((blog) => ({
    ...blog,
    category: categoryMap.get(blog.category) || null,
    author: authorMap.get(blog.author_id) || null,
  }));
}

meRouter.get('/profile', authenticateRequest, requireAuth, async (req, res, next) => {
  try {
    const user = req.auth.user;

    const { data, error } = await supabase
      .from('likes')
      .select('created_at, blog:blogs(id, title, slug, category, cover_image_url, summary, content, author_id, status, ai_generated, read_time, likes_count, created_at, updated_at)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const likedRows = (data || []).filter((row) => row.blog);
    const likedBlogs = await hydrateBlogs(likedRows.map((row) => row.blog));

    const likedBlogsWithMeta = likedBlogs.map((blog, index) => ({
      ...blog,
      liked_at: likedRows[index]?.created_at || null,
    }));

    return res.json({
      ok: true,
      user,
      activity: {
        joinedAt: user.created_at,
        totalLikes: likedBlogsWithMeta.length,
      },
      likedBlogs: likedBlogsWithMeta,
    });
  } catch (error) {
    return next(error);
  }
});