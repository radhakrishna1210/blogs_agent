import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { demoCategories, isSchemaMissingError, addDemoBlog, buildDemoBlogFromInput } from '../data/demoContent.js';
import { topics } from '../data/topics.js';
import { authenticateRequest, requireAdmin, requireAuth } from '../middleware/auth.js';
import { env } from '../config/env.js';
import { generateGroqBlog } from '../services/anthropic.js';
import { generateBlogCoverImage } from '../services/geminiImage.js';
import { createHttpError } from '../utils/httpError.js';

export const adminRouter = Router();

// ---------------------------------------------------------------------------
// In-memory settings state (survives process lifetime, resets on server restart)
// Supabase `settings` table is used when available; this is the fallback.
// ---------------------------------------------------------------------------
let inMemoryAutoPosting = true; // default ON

async function getAutoPostingSetting() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'auto_posting_enabled')
      .maybeSingle();
    if (error || !data) return inMemoryAutoPosting;
    return data.value === 'true' || data.value === true;
  } catch {
    return inMemoryAutoPosting;
  }
}

async function setAutoPostingSetting(enabled) {
  inMemoryAutoPosting = enabled;
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'auto_posting_enabled', value: String(enabled) }, { onConflict: 'key' });
    if (error) {
      console.warn('[settings] Supabase upsert failed, using in-memory fallback:', error.message);
    }
  } catch (err) {
    console.warn('[settings] Settings table not available, using in-memory fallback:', err.message);
  }
}

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

    // Always generate a unique cover image for every blog post
    let coverImageUrl = null;
    const blogTitle = generated.humanized?.title || generated.draft?.title || '';
    const imageDescription =
      generated.humanized?.suggested_cover_image_description
      || generated.draft?.suggested_cover_image_description
      || `A visually striking, editorial-quality cover image for a blog article titled "${blogTitle}". The article is about: ${String(prompt).trim().slice(0, 200)}`;

    try {
      coverImageUrl = await generateBlogCoverImage({
        description: imageDescription,
        blogTitle,
        categoryName: categoryRecord.name,
      });
      console.log('Cover image generated successfully:', coverImageUrl);
    } catch (imageError) {
      console.error('Cover image generation failed:', imageError.message);
    }

    return res.json({
      ok: true,
      category: categoryRecord,
      blog: {
        ...generated.humanized,
        cover_image_url: coverImageUrl,
      },
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

// ---------------------------------------------------------------------------
// GET /api/admin/settings — read admin settings (auth required)
// PATCH /api/admin/settings — update admin settings (admin required)
// ---------------------------------------------------------------------------
adminRouter.get('/settings', authenticateRequest, requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const autoPosting = await getAutoPostingSetting();
    return res.json({ ok: true, auto_posting_enabled: autoPosting });
  } catch (error) {
    return next(error);
  }
});

adminRouter.patch('/settings', authenticateRequest, requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { auto_posting_enabled } = req.body || {};
    if (typeof auto_posting_enabled !== 'boolean') {
      return next(createHttpError(400, 'auto_posting_enabled must be a boolean.', 'VALIDATION_ERROR'));
    }
    await setAutoPostingSetting(auto_posting_enabled);
    return res.json({ ok: true, auto_posting_enabled });
  } catch (error) {
    return next(error);
  }
});

adminRouter.post('/auto-publish', async (req, res, next) => {
  try {
    const incomingSecret = req.headers['x-cron-secret'];
    if (!env.cronSecret || incomingSecret !== env.cronSecret) {
      return next(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));
    }

    // Check toggle — if auto-posting is disabled, reject gracefully
    const autoPostingEnabled = await getAutoPostingSetting();
    if (!autoPostingEnabled) {
      return res.status(200).json({ ok: false, skipped: true, reason: 'Auto-posting is currently disabled by admin.' });
    }

    const {
      title: prewrittenTitle,
      content: prewrittenContent,
      summary: prewrittenSummary,
      cover_image_url: prewrittenCoverUrl,
      category: categoryInput,
      topic,
      prompt,
    } = req.body || {};

    let title, content, summary, coverImageUrl, categoryName;

    // --- PATH A: Claude wrote the blog (title + content provided directly) ---
    if (prewrittenTitle && prewrittenContent) {
      title = String(prewrittenTitle).trim();
      content = String(prewrittenContent).trim();
      summary = prewrittenSummary ? String(prewrittenSummary).trim() : '';
      coverImageUrl = prewrittenCoverUrl ? String(prewrittenCoverUrl).trim() : null;
      categoryName = categoryInput || topics[Math.floor(Math.random() * topics.length)].title;
      console.log('[auto-publish] Claude-written path — skipping Groq and Gemini.');

    // --- PATH B: Groq + Gemini generation (manual trigger or legacy) ---
    } else {
      let topicPrompt = topic || prompt;
      categoryName = categoryInput;

      if (!topicPrompt) {
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        topicPrompt = `Write an engaging blog post about ${randomTopic.title}. Focus on: ${randomTopic.summary}`;
        if (!categoryName) categoryName = randomTopic.title;
      }

      if (!categoryName) {
        categoryName = topics[Math.floor(Math.random() * topics.length)].title;
      }

      const categoryRecord = await resolveCategory(categoryName);
      if (!categoryRecord) {
        return next(createHttpError(400, 'Category not found.', 'CATEGORY_NOT_FOUND'));
      }

      const generated = await generateGroqBlog({
        prompt: String(topicPrompt).trim(),
        categoryName: categoryRecord.name,
      });

      title = generated.humanized?.title || generated.draft?.title || '';
      content = generated.humanized?.content || generated.draft?.content || '';
      summary = generated.humanized?.summary || generated.draft?.summary || '';
      categoryName = categoryRecord.name;

      const imageDescription =
        generated.humanized?.suggested_cover_image_description ||
        generated.draft?.suggested_cover_image_description ||
        `A visually striking, editorial-quality cover image for a blog article titled "${title}".`;

      coverImageUrl = null;
      try {
        coverImageUrl = await generateBlogCoverImage({
          description: imageDescription,
          blogTitle: title,
          categoryName: categoryRecord.name,
        });
      } catch (imageError) {
        console.error('Auto-publish cover image generation failed:', imageError.message);
      }
    }

    // Resolve final category record for DB insert (both paths need this)
    const resolvedCategory = await resolveCategory(categoryName);
    if (!resolvedCategory) {
      return next(createHttpError(400, 'Category not found.', 'CATEGORY_NOT_FOUND'));
    }

    // Check database state or if schema is missing
    let finalCategory = null;
    let authorId = null;
    let isDemoMode = false;

    try {
      const { data: dbCategories } = await supabase.from('categories').select('*');
      if (dbCategories && dbCategories.length > 0) {
        const targetName = resolvedCategory.name.toLowerCase();
        finalCategory = dbCategories.find(c => c.name.toLowerCase() === targetName || c.slug.toLowerCase() === targetName);
        if (!finalCategory) {
          finalCategory = dbCategories[0];
        }
      } else {
        // Categories table is empty or missing, try inserting
        const { data: newCat } = await supabase
          .from('categories')
          .insert({
            name: resolvedCategory.name,
            slug: resolvedCategory.slug,
            icon: resolvedCategory.icon,
            description: resolvedCategory.description
          })
          .select('*')
          .single();
        if (newCat) {
          finalCategory = newCat;
        } else {
          isDemoMode = true;
          finalCategory = resolvedCategory;
        }
      }
    } catch (err) {
      if (isSchemaMissingError(err)) {
        isDemoMode = true;
      }
      finalCategory = resolvedCategory;
    }

    if (!isDemoMode) {
      try {
        const { data: adminUser } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'admin')
          .limit(1)
          .maybeSingle();

        if (adminUser) {
          authorId = adminUser.id;
        } else {
          const { data: anyUser } = await supabase
            .from('users')
            .select('id')
            .limit(1)
            .maybeSingle();

          if (anyUser) {
            authorId = anyUser.id;
          } else {
            const adminEmail = env.adminEmail || 'admin@aperture.dev';
            const { data: newAdmin } = await supabase
              .from('users')
              .insert({
                google_id: 'auto-publish-admin',
                email: adminEmail,
                name: 'Aperture Admin',
                role: 'admin'
              })
              .select('id')
              .single();

            if (newAdmin) {
              authorId = newAdmin.id;
            } else {
              isDemoMode = true;
            }
          }
        }
      } catch (err) {
        isDemoMode = true;
      }
    }

    if (isDemoMode) {
      const demoBlog = addDemoBlog(buildDemoBlogFromInput({
        title,
        content,
        category: finalCategory,
        cover_image_url: coverImageUrl,
        summary,
        ai_generated: true,
        author_id: 'demo-author'
      }));

      return res.json({
        ok: true,
        title: demoBlog.title,
        slug: demoBlog.slug
      });
    }

    const slug = await generateUniqueSlug(title);
    const readTime = getReadTimeMinutes(content);

    const { data: blog, error: insertError } = await supabase
      .from('blogs')
      .insert({
        title,
        slug,
        category: finalCategory.id,
        cover_image_url: coverImageUrl,
        content,
        summary,
        author_id: authorId,
        status: 'published',
        ai_generated: true,
        read_time: readTime,
        likes_count: 0
      })
      .select('title, slug')
      .single();

    if (insertError) {
      throw insertError;
    }

    return res.json({
      ok: true,
      title: blog.title,
      slug: blog.slug
    });
  } catch (error) {
    return next(error);
  }
});

