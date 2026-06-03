import dotenv from 'dotenv';
import { supabase } from '../src/config/supabase.js';

dotenv.config();

const categories = [
  {
    name: 'AI and Technology',
    slug: 'ai-and-technology',
    icon: '🤖',
    description: 'AI tools, coding, automation, and the future of software.',
  },
  {
    name: 'Personal Finance',
    slug: 'personal-finance',
    icon: '💸',
    description: 'Budgeting, investing, savings, and money-making ideas.',
  },
  {
    name: 'Productivity and Self Improvement',
    slug: 'productivity-and-self-improvement',
    icon: '⚡',
    description: 'Focus, habits, routines, and systems for better work.',
  },
  {
    name: 'Health and Wellness',
    slug: 'health-and-wellness',
    icon: '🧘',
    description: 'Mental health, fitness, sleep, and balanced living.',
  },
  {
    name: 'Startup and Entrepreneurship',
    slug: 'startup-and-entrepreneurship',
    icon: '🚀',
    description: 'Founder stories, lessons, failures, and startup growth.',
  },
  {
    name: 'Career and Jobs',
    slug: 'career-and-jobs',
    icon: '💼',
    description: 'Hiring, resumes, freelancing, remote work, and careers.',
  },
  {
    name: 'Design and Creativity',
    slug: 'design-and-creativity',
    icon: '🎨',
    description: 'UI/UX, branding, Figma tips, and visual storytelling.',
  },
  {
    name: 'Science and Future Tech',
    slug: 'science-and-future-tech',
    icon: '🔬',
    description: 'Space, biotech, climate tech, and emerging science.',
  },
  {
    name: 'Culture and Society',
    slug: 'culture-and-society',
    icon: '🌍',
    description: 'Opinion, trends, social shifts, and commentary.',
  },
  {
    name: 'Travel and Lifestyle',
    slug: 'travel-and-lifestyle',
    icon: '✈️',
    description: 'Travel stories, slow living, and lifestyle essays.',
  },
];

function hasPlaceholderSupabaseEnv() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return (
    !url ||
    !key ||
    url.includes('YOUR_PROJECT_REF') ||
    key.includes('your-service-role-secret-key')
  );
}

async function main() {
  if (hasPlaceholderSupabaseEnv()) {
    throw new Error('Set real SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY values before running the seed.');
  }

  const { error: upsertError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' });

  if (upsertError) {
    throw upsertError;
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, icon, description')
    .in('slug', categories.map((category) => category.slug))
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  const insertedSlugs = new Set((data || []).map((category) => category.slug));
  const missing = categories.filter((category) => !insertedSlugs.has(category.slug));

  if (missing.length) {
    throw new Error(`Seed incomplete. Missing categories: ${missing.map((item) => item.slug).join(', ')}`);
  }

  console.log(`Seeded ${data.length} categories successfully.`);
  console.table(data);
}

main().catch((error) => {
  console.error('[seed-categories] failed:', error.message);
  process.exitCode = 1;
});
