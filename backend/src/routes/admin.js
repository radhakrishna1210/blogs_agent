import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { demoCategories, isSchemaMissingError } from '../data/demoContent.js';
import { authenticateRequest, requireAdmin, requireAuth } from '../middleware/auth.js';
import { generateGroqBlog } from '../services/anthropic.js';
import { createHttpError } from '../utils/httpError.js';

export const adminRouter = Router();

const blogSelectFields = 'id, title, slug, category, cover_image_url, summary, content, author_id, status, ai_generated, read_time, likes_count, created_at, updated_at';

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

async function resolveCategory(categoryValue) {
  const rawValue = String(categoryValue || '').trim();

  if (!rawValue) {
    return null;
  }

  const normalizedValue = rawValue.toLowerCase();
  const looksLikeUuid = /^[0-9a-fA-F-]{36}$/.test(rawValue);

  try {
    if (looksLikeUuid) {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, icon, description')
        .eq('id', rawValue)
        .maybeSingle();

      if (error) throw error;
      if (data) return data;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, icon, description')
      .or(`slug.eq.${normalizedValue},name.eq.${rawValue}`)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;

    // Fallback if DB query succeeded but returned no rows
    return demoCategories.find(
      (category) =>
        category.slug === normalizedValue ||
        category.name.toLowerCase() === normalizedValue ||
        category.id === rawValue
    ) || null;
  } catch (error) {
    if (isSchemaMissingError(error)) {
      return demoCategories.find(
        (category) =>
          category.slug === normalizedValue ||
          category.name.toLowerCase() === normalizedValue ||
          category.id === rawValue
      ) || null;
    }

    throw error;
  }
}

adminRouter.post('/generate-blog', authenticateRequest, requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { prompt, category } = req.body || {};

    if (!prompt || !category) {
      return next(createHttpError(400, 'prompt and category are required.', 'VALIDATION_ERROR'));
    }

    const categoryRecord = await resolveCategory(category);

    if (!categoryRecord) {
      return next(createHttpError(400, 'Category not found.', 'CATEGORY_NOT_FOUND'));
    }

    const generated = await generateGroqBlog({
      prompt: String(prompt).trim(),
      categoryName: categoryRecord.name,
    });

    return res.json({
      ok: true,
      category: categoryRecord,
      blog: generated.humanized,
      draft: generated.draft,
      note: 'Review the humanized blog and publish it manually if it looks good.',
    });
  } catch (error) {
    return next(error);
  }
});

adminRouter.get('/dashboard', authenticateRequest, requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const [blogsCountResult, usersCountResult, likesCountResult, recentBlogsResult] = await Promise.all([
      supabase.from('blogs').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('likes').select('id', { count: 'exact', head: true }),
      supabase
        .from('blogs')
        .select(blogSelectFields)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    if (blogsCountResult.error) {
      if (isSchemaMissingError(blogsCountResult.error)) {
        return res.json({
          ok: true,
          stats: {
            totalBlogs: 0,
            totalUsers: 0,
            totalLikes: 0,
          },
          recentBlogs: [],
        });
      }

      throw blogsCountResult.error;
    }

    if (usersCountResult.error) {
      if (isSchemaMissingError(usersCountResult.error)) {
        return res.json({
          ok: true,
          stats: {
            totalBlogs: 0,
            totalUsers: 0,
            totalLikes: 0,
          },
          recentBlogs: [],
        });
      }

      throw usersCountResult.error;
    }

    if (likesCountResult.error) {
      if (isSchemaMissingError(likesCountResult.error)) {
        return res.json({
          ok: true,
          stats: {
            totalBlogs: 0,
            totalUsers: 0,
            totalLikes: 0,
          },
          recentBlogs: [],
        });
      }

      throw likesCountResult.error;
    }

    if (recentBlogsResult.error) {
      if (isSchemaMissingError(recentBlogsResult.error)) {
        return res.json({
          ok: true,
          stats: {
            totalBlogs: 0,
            totalUsers: 0,
            totalLikes: 0,
          },
          recentBlogs: [],
        });
      }

      throw recentBlogsResult.error;
    }

    const recentBlogs = await hydrateBlogs(recentBlogsResult.data || []);

    return res.json({
      ok: true,
      stats: {
        totalBlogs: blogsCountResult.count || 0,
        totalUsers: usersCountResult.count || 0,
        totalLikes: likesCountResult.count || 0,
      },
      recentBlogs,
    });
  } catch (error) {
    return next(error);
  }
});

adminRouter.get('/blogs', authenticateRequest, requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const { data, error, count } = await supabase
      .from('blogs')
      .select(blogSelectFields, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      if (isSchemaMissingError(error)) {
        return res.json({
          ok: true,
          count: 0,
          blogs: [],
        });
      }

      throw error;
    }

    const blogs = await hydrateBlogs(data || []);

    return res.json({
      ok: true,
      count: count || 0,
      blogs,
    });
  } catch (error) {
    return next(error);
  }
});
