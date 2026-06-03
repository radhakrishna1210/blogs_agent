export type Topic = {
  slug: string;
  title: string;
  summary: string;
  editor: string;
  count: string;
  accent: string;
};

export type Story = {
  topic: string;
  title: string;
  summary: string;
  author: string;
  readTime: string;
  accent: string;
};

export const topics: Topic[] = [
  {
    slug: 'ai-and-technology',
    title: 'AI & Technology',
    summary: 'AI tools, ChatGPT vs Claude comparisons, automation, coding tutorials, and how AI is changing everything else.',
    editor: 'Iris',
    count: '184',
    accent: '#b86040',
  },
  {
    slug: 'personal-finance',
    title: 'Personal Finance & Money',
    summary: 'Budget tips, investing for beginners, side hustles, passive income, and money stories that travel well.',
    editor: 'Ledger',
    count: '210',
    accent: '#5a7a6e',
  },
  {
    slug: 'productivity-and-self-improvement',
    title: 'Productivity & Self Improvement',
    summary: 'Second brain systems, Notion setups, morning routines, deep work, and habit building for modern work.',
    editor: 'Onyx',
    count: '170',
    accent: '#7a5a8e',
  },
  {
    slug: 'health-and-wellness',
    title: 'Health & Wellness',
    summary: 'Mental health, sleep science, fitness without the gym, gut health, and mindfulness that people actually keep.',
    editor: 'Soma',
    count: '150',
    accent: '#5a7a4a',
  },
  {
    slug: 'startup-and-entrepreneurship',
    title: 'Startup & Entrepreneurship',
    summary: 'Behind the scenes of building a startup, failure stories, founder lessons, and 30-day build experiments.',
    editor: 'Atlas',
    count: '96',
    accent: '#a85a3a',
  },
  {
    slug: 'career-and-jobs',
    title: 'Career & Jobs',
    summary: 'How to get hired, resume tips, switching careers, freelancing, remote work, and salary negotiation.',
    editor: 'Vega',
    count: '132',
    accent: '#3a5570',
  },
  {
    slug: 'design-and-creativity',
    title: 'Design & Creativity',
    summary: 'UI/UX trends, creative tools, Figma tips, branding, and visual storytelling for builders and designers.',
    editor: 'Ada',
    count: '120',
    accent: '#b86040',
  },
  {
    slug: 'science-and-future-tech',
    title: 'Science & Future Tech',
    summary: 'Space, biotech, climate tech, quantum computing, and long-form takes on what the next decade could look like.',
    editor: 'Iris',
    count: '98',
    accent: '#5a7a6e',
  },
  {
    slug: 'culture-and-society',
    title: 'Culture & Society',
    summary: 'Opinion pieces, social trends, nostalgia content, and what is happening in the world right now.',
    editor: 'Margin',
    count: '88',
    accent: '#1b2845',
  },
  {
    slug: 'travel-and-lifestyle',
    title: 'Travel & Lifestyle',
    summary: 'Solo travel stories, budget guides, moving abroad, and slow living content that fits visual-first blogs.',
    editor: 'Solas',
    count: '64',
    accent: '#5a7a4a',
  },
];

export const featuredStories: Story[] = [
  {
    topic: 'AI & Technology',
    title: 'How the blog backend can power AI-assisted publishing later',
    summary: 'This scaffold keeps content and infrastructure separate so the design can grow without turning the stack into a mess.',
    author: 'Iris · 8 min read',
    readTime: '8 min',
    accent: '#b86040',
  },
  {
    topic: 'Design & Creativity',
    title: 'Why the Aperture palette stays warm instead of default-cool',
    summary: 'The system uses ink, accent, bg, paper, muted, rule, soft, and accent2 to keep the editorial tone consistent.',
    author: 'Ada · 6 min read',
    readTime: '6 min',
    accent: '#7a5a8e',
  },
  {
    topic: 'Startup & Entrepreneurship',
    title: 'A structure you can hand to the industry without rebuilding it later',
    summary: 'Monorepo workspaces make the frontend and backend easy to connect once the content model is ready.',
    author: 'Atlas · 5 min read',
    readTime: '5 min',
    accent: '#a85a3a',
  },
];
