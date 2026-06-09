import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import {
  addDemoBlog,
  buildDemoBlogFromInput,
  demoCategories,
  getDemoBlogBySlug,
  getDemoCategoryBySlug,
  getDemoCategoryById,
  isSchemaMissingError,
  listDemoBlogs,
} from '../data/demoContent.js';
import { authenticateRequest, requireAdmin, requireAuth } from '../middleware/auth.js';
import { createHttpError } from '../utils/httpError.js';

export const blogsRouter = Router();

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeText(value) {
  return String(value || '')
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getWordCount(content) {
  return String(content || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function getReadTimeMinutes(content) {
  const wordCount = getWordCount(content);
  return Math.max(1, Math.ceil(wordCount / 200));
}

async function resolveCategoryId(categoryValue) {
  const rawValue = String(categoryValue || '').trim();

  if (!rawValue) {
    return null;
  }

  // Handle demo category IDs (e.g. category-1)
  if (rawValue.startsWith('category-')) {
    return getDemoCategoryById(rawValue);
  }

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

    const slug = rawValue.toLowerCase();
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, icon, description')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;

    // Fallback if DB query succeeded but returned no rows
    return getDemoCategoryBySlug(slug) || getDemoCategoryById(slug);
  } catch (error) {
    if (isSchemaMissingError(error)) {
      return getDemoCategoryBySlug(rawValue.toLowerCase()) || getDemoCategoryById(rawValue);
    }

    throw error;
  }
}

async function generateUniqueSlug(title) {
  const baseSlug = normalizeText(title) || 'blog-post';

  const { data, error } = await supabase
    .from('blogs')
    .select('slug')
    .ilike('slug', `${baseSlug}%`);

  if (error) {
    throw error;
  }

  const existingSlugs = new Set((data || []).map((row) => row.slug));
  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  while (existingSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

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

async function getBlogById(blogId) {
  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, slug, category, cover_image_url, content, summary, author_id, status, ai_generated, read_time, likes_count, created_at, updated_at')
    .eq('id', blogId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const hydrated = await hydrateBlogs([data]);
  return hydrated[0] || null;
}

blogsRouter.get('/', async (req, res, next) => {
  try {
    const page = toPositiveInt(req.query.page, 1);
    const limit = Math.min(toPositiveInt(req.query.limit, 10), 100);
    const search = String(req.query.search || req.query.q || '').trim();
    const categoryFilter = String(req.query.category || '').trim();

    let query = supabase
      .from('blogs')
      .select('id, title, slug, category, cover_image_url, summary, author_id, status, ai_generated, read_time, likes_count, created_at, updated_at', { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (categoryFilter) {
      const category = await resolveCategoryId(categoryFilter);
      if (!category) {
        return res.json({ ok: true, page, limit, total: 0, totalPages: 0, blogs: [] });
      }

      query = query.eq('category', category.id);
    }

    if (search) {
      const safeSearch = search
        .replace(/,/g, ' ')
        .replace(/%/g, '\\%')
        .replace(/\*/g, '')
        .replace(/'/g, '')
        .replace(/"/g, '');
      query = query.or(`title.ilike.%${safeSearch}%,summary.ilike.%${safeSearch}%,content.ilike.%${safeSearch}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.range(from, to);

    if (error) {
      if (isSchemaMissingError(error)) {
        const fallbackBlogs = listDemoBlogs();
        const filteredBlogs = categoryFilter
          ? fallbackBlogs.filter((blog) => blog.category?.slug === categoryFilter)
          : fallbackBlogs;

        const searchedBlogs = search
          ? filteredBlogs.filter((blog) => {
            const searchable = `${blog.title} ${blog.summary || ''} ${blog.content}`.toLowerCase();
            return searchable.includes(search.toLowerCase());
          })
          : filteredBlogs;

        const total = searchedBlogs.length;
        const pageBlogs = searchedBlogs.slice(from, to + 1);

        return res.json({
          ok: true,
          page,
          limit,
          total,
          totalPages: total ? Math.ceil(total / limit) : 0,
          blogs: pageBlogs,
        });
      }

      throw error;
    }

    const blogs = await hydrateBlogs(data || []);
    const total = count || 0;

    return res.json({
      ok: true,
      page,
      limit,
      total,
      totalPages: total ? Math.ceil(total / limit) : 0,
      blogs,
    });
  } catch (error) {
    return next(error);
  }
});

blogsRouter.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug, category, cover_image_url, content, summary, author_id, status, ai_generated, read_time, likes_count, created_at, updated_at')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      if (isSchemaMissingError(error)) {
        const demoBlog = getDemoBlogBySlug(slug);

        if (!demoBlog) {
          return next(createHttpError(404, 'Blog not found', 'BLOG_NOT_FOUND'));
        }

        return res.json({ ok: true, blog: demoBlog });
      }

      throw error;
    }

    if (!data) {
      return next(createHttpError(404, 'Blog not found', 'BLOG_NOT_FOUND'));
    }

    const hydrated = await hydrateBlogs([data]);
    return res.json({ ok: true, blog: hydrated[0] });
  } catch (error) {
    return next(error);
  }
});

blogsRouter.post('/', authenticateRequest, requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { title, content, category, cover_image_url, summary, ai_generated } = req.body || {};

    if (!title || !content || !category) {
      return next(createHttpError(400, 'title, content, and category are required.', 'VALIDATION_ERROR'));
    }

    const categoryRecord = await resolveCategoryId(category);
    if (!categoryRecord) {
      return next(createHttpError(400, 'Category not found.', 'CATEGORY_NOT_FOUND'));
    }

    const slug = await generateUniqueSlug(title);
    const readTime = getReadTimeMinutes(content);

    const { data, error } = await supabase
      .from('blogs')
      .insert({
        title: String(title).trim(),
        slug,
        category: categoryRecord.id,
        cover_image_url: cover_image_url ? String(cover_image_url).trim() : null,
        content: String(content),
        summary: summary ? String(summary).trim() : null,
        author_id: req.auth.userId,
        status: 'published',
        ai_generated: Boolean(ai_generated),
        read_time: readTime,
        likes_count: 0,
      })
      .select('id, title, slug, category, cover_image_url, content, summary, author_id, status, ai_generated, read_time, likes_count, created_at, updated_at')
      .single();

    if (error) {
      if (isSchemaMissingError(error)) {
        const demoBlog = addDemoBlog(buildDemoBlogFromInput({
          title,
          content,
          category: getDemoCategoryBySlug(String(category).trim().toLowerCase()) || demoCategories[0],
          cover_image_url,
          summary,
          ai_generated,
          author_id: req.auth.userId,
        }));

        return res.status(201).json({ ok: true, blog: demoBlog });
      }

      throw error;
    }

    const hydrated = await hydrateBlogs([data]);

    return res.status(201).json({ ok: true, blog: hydrated[0] });
  } catch (error) {
    return next(error);
  }
});

blogsRouter.delete('/:id', authenticateRequest, requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: existingBlog, error: fetchError } = await supabase
      .from('blogs')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingBlog) {
      return next(createHttpError(404, 'Blog not found', 'BLOG_NOT_FOUND'));
    }

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return res.json({ ok: true, deleted: true });
  } catch (error) {
    return next(error);
  }
});

blogsRouter.post('/:id/like', authenticateRequest, requireAuth, async (req, res, next) => {
  try {
    const { id: blogId } = req.params;
    const userId = req.auth.userId;

    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('id, likes_count')
      .eq('id', blogId)
      .maybeSingle();

    if (blogError) {
      throw blogError;
    }

    if (!blog) {
      return next(createHttpError(404, 'Blog not found', 'BLOG_NOT_FOUND'));
    }

    const { data: existingLike, error: likeFetchError } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('blog_id', blogId)
      .maybeSingle();

    if (likeFetchError) {
      throw likeFetchError;
    }

    let liked = false;
    let likesCount = blog.likes_count || 0;

    if (existingLike) {
      const { error: deleteLikeError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteLikeError) {
        throw deleteLikeError;
      }

      likesCount = Math.max(0, likesCount - 1);
    } else {
      const { error: createLikeError } = await supabase
        .from('likes')
        .insert({ user_id: userId, blog_id: blogId });

      if (createLikeError) {
        throw createLikeError;
      }

      likesCount += 1;
      liked = true;
    }

    const { error: updateBlogError } = await supabase
      .from('blogs')
      .update({ likes_count: likesCount })
      .eq('id', blogId);

    if (updateBlogError) {
      throw updateBlogError;
    }

    return res.json({
      ok: true,
      liked,
      likes_count: likesCount,
    });
  } catch (error) {
    return next(error);
  }
});

blogsRouter.get('/:id/liked', authenticateRequest, requireAuth, async (req, res, next) => {
  try {
    const { id: blogId } = req.params;
    const userId = req.auth.userId;

    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('blog_id', blogId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return res.json({
      ok: true,
      liked: Boolean(data),
    });
  } catch (error) {
    return next(error);
  }
});
