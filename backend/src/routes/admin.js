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

adminRouter.post('/auto-publish', async (req, res, next) => {
  try {
    const incomingSecret = req.headers['x-cron-secret'];
    if (!env.cronSecret || incomingSecret !== env.cronSecret) {
      return next(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));
    }

    let topic = req.body?.topic || req.body?.prompt;
    let categoryName = req.body?.category;

    if (!topic) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      topic = `Write an engaging blog post about ${randomTopic.title}. Focus on: ${randomTopic.summary}`;
      if (!categoryName) {
        categoryName = randomTopic.title;
      }
    }

    if (!categoryName) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      categoryName = randomTopic.title;
    }

    const categoryRecord = await resolveCategory(categoryName);
    if (!categoryRecord) {
      return next(createHttpError(400, 'Category not found.', 'CATEGORY_NOT_FOUND'));
    }

    const generated = await generateGroqBlog({
      prompt: String(topic).trim(),
      categoryName: categoryRecord.name,
    });

    const blogTitle = generated.humanized?.title || generated.draft?.title || '';
    const imageDescription =
      generated.humanized?.suggested_cover_image_description ||
      generated.draft?.suggested_cover_image_description ||
      `A visually striking, editorial-quality cover image for a blog article titled "${blogTitle}".`;

    let coverImageUrl = null;
    try {
      coverImageUrl = await generateBlogCoverImage({
        description: imageDescription,
        blogTitle,
        categoryName: categoryRecord.name,
      });
    } catch (imageError) {
      console.error('Auto-publish cover image generation failed:', imageError.message);
    }

    const title = blogTitle;
    const content = generated.humanized?.content || generated.draft?.content || '';
    const summary = generated.humanized?.summary || generated.draft?.summary || '';

    // Check database state or if schema is missing
    let finalCategory = null;
    let authorId = null;
    let isDemoMode = false;

    try {
      const { data: dbCategories } = await supabase.from('categories').select('*');
      if (dbCategories && dbCategories.length > 0) {
        const targetName = categoryRecord.name.toLowerCase();
        finalCategory = dbCategories.find(c => c.name.toLowerCase() === targetName || c.slug.toLowerCase() === targetName);
        if (!finalCategory) {
          finalCategory = dbCategories[0];
        }
      } else {
        // Categories table is empty or missing, try inserting
        const { data: newCat } = await supabase
          .from('categories')
          .insert({
            name: categoryRecord.name,
            slug: categoryRecord.slug,
            icon: categoryRecord.icon,
            description: categoryRecord.description
          })
          .select('*')
          .single();
        if (newCat) {
          finalCategory = newCat;
        } else {
          isDemoMode = true;
          finalCategory = categoryRecord;
        }
      }
    } catch (err) {
      if (isSchemaMissingError(err)) {
        isDemoMode = true;
      }
      finalCategory = categoryRecord;
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

