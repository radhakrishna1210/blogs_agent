import { topics } from './topics.js';

function createId(prefix, index) {
  return `${prefix}-${index + 1}`;
}

function buildHtmlContent(topic) {
  return [
    `<h2>${topic.title}</h2>`,
    `<p>${topic.summary}</p>`,
    '<h2>Why this topic matters</h2>',
    '<p>This is a starter article generated from the project demo data so the site can render before Supabase is seeded.</p>',
    '<h2>What comes next</h2>',
    '<p>Once the Supabase schema is applied, generated posts and published stories will replace these demo entries automatically.</p>',
  ].join('');
}

export const demoCategories = topics.map((topic, index) => ({
  id: createId('category', index),
  name: topic.title,
  slug: topic.slug,
  icon: '•',
  description: topic.summary,
}));

export const demoBlogs = topics.map((topic, index) => ({
  id: createId('blog', index),
  title: `${topic.title}: a starter Aperture article`,
  slug: `${topic.slug}-starter-article`,
  category: demoCategories[index],
  cover_image_url: null,
  summary: topic.summary,
  content: buildHtmlContent(topic),
  author_id: 'demo-author',
  author: null,
  status: 'published',
  ai_generated: true,
  read_time: 3,
  likes_count: 0,
  created_at: '2026-05-30T00:00:00.000Z',
  updated_at: '2026-05-30T00:00:00.000Z',
}));

export function isSchemaMissingError(error) {
  return error?.code === 'PGRST205';
}

export function getDemoCategoryBySlug(slug) {
  return demoCategories.find((category) => category.slug === slug) || null;
}

export function getDemoCategoryById(id) {
  return demoCategories.find((category) => category.id === id) || null;
}

export function getDemoBlogBySlug(slug) {
  return demoBlogs.find((blog) => blog.slug === slug) || null;
}

export function listDemoBlogs() {
  return [...demoBlogs];
}

export function addDemoBlog(blog) {
  demoBlogs.unshift(blog);
  return blog;
}

export function buildDemoBlogFromInput({ title, content, category, cover_image_url, summary, ai_generated, author_id }) {
  const categoryRecord = typeof category === 'object' ? category : getDemoCategoryBySlug(String(category || '').trim());
  const safeTitle = String(title || 'Untitled blog').trim();
  const slug = safeTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return {
    id: `demo-${Date.now()}`,
    title: safeTitle,
    slug: `${slug || 'blog-post'}-${Date.now().toString(36)}`,
    category: categoryRecord,
    cover_image_url: cover_image_url || null,
    summary: summary || null,
    content: String(content || ''),
    author_id: author_id || 'demo-author',
    author: null,
    status: 'published',
    ai_generated: Boolean(ai_generated),
    read_time: Math.max(1, Math.ceil(String(content || '').split(/\s+/).filter(Boolean).length / 200)),
    likes_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}