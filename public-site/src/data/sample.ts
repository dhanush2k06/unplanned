import type { Article, ArticleSummary, Category, SiteSettings } from '../types';

export const defaultSettings: SiteSettings = {
  siteName: 'Dhanush',
  siteDescription: 'Personal notes on building, learning, and documenting the work.',
  authorName: 'Dhanush',
  authorBio:
    "I'm a student and technology enthusiast interested in AI, data, software, and building useful products. I use this blog to document things I'm learning, projects I'm building, technical experiments, lessons from failures, and ideas I'm exploring.",
  profileImage: '',
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    medium: '',
  },
};

export const sampleCategories: Category[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Articles about AI and machine learning',
  },
  {
    id: 'data',
    name: 'Data Analytics',
    slug: 'data-analytics',
    description: 'Working with data, analysis, and insight',
  },
  {
    id: 'programming',
    name: 'Programming',
    slug: 'programming',
    description: 'Languages, patterns, and craft',
  },
  {
    id: 'web',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Building for the web',
  },
  {
    id: 'projects',
    name: 'Projects',
    slug: 'projects',
    description: 'Build logs and product notes',
  },
];

const sampleMarkdown = `# Why this exists

I built this space to write in public: projects, experiments, and the parts of learning that usually stay in private notes.

## A small example

> The work compounds when you write it down.

Here is a snippet you might see in a real post:

\`\`\`ts
const article = await getPublishedArticleBySlug(slug);
if (!article) throw new Error('Not found');
\`\`\`

The rest of the post would go deeper — architecture, trade-offs, and what I would change next time.
`;

export const sampleArticles: Article[] = [
  {
    id: '1',
    title: 'How I Think About Building in Public',
    slug: 'how-i-think-about-building-in-public',
    excerpt:
      'A working note on documenting projects, experiments, and the parts of learning that usually stay private.',
    content: sampleMarkdown,
    coverImage: '',
    status: 'published',
    category: 'Projects',
    categorySlug: 'projects',
    tags: ['Writing', 'Projects', 'Learning'],
    authorId: 'local',
    authorName: 'Dhanush',
    readingTime: 4,
    seoTitle: 'How I Think About Building in Public',
    seoDescription: 'Notes on documenting projects and learning in public.',
    canonicalUrl: '',
    createdAt: '2026-08-12T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z',
    publishedAt: '2026-08-20T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'A Practical Starting Point for Computer Vision Projects',
    slug: 'practical-starting-point-computer-vision',
    excerpt: 'How I scope a vision project so it stays shippable instead of becoming a research rabbit hole.',
    content: sampleMarkdown,
    coverImage: '',
    status: 'published',
    category: 'Artificial Intelligence',
    categorySlug: 'artificial-intelligence',
    tags: ['AI', 'Computer Vision'],
    authorId: 'local',
    authorName: 'Dhanush',
    readingTime: 7,
    seoTitle: 'A Practical Starting Point for Computer Vision Projects',
    seoDescription: 'Scoping computer vision work so it stays shippable.',
    canonicalUrl: '',
    createdAt: '2026-07-02T10:00:00.000Z',
    updatedAt: '2026-07-08T10:00:00.000Z',
    publishedAt: '2026-07-08T10:00:00.000Z',
  },
  {
    id: '3',
    title: 'Notes on Firestore Data Modeling for a Small Blog',
    slug: 'firestore-data-modeling-small-blog',
    excerpt: 'Collections, published-only reads, and why drafts never belong on the public site.',
    content: sampleMarkdown,
    coverImage: '',
    status: 'published',
    category: 'Web Development',
    categorySlug: 'web-development',
    tags: ['Firebase', 'React'],
    authorId: 'local',
    authorName: 'Dhanush',
    readingTime: 6,
    seoTitle: 'Notes on Firestore Data Modeling for a Small Blog',
    seoDescription: 'Modeling articles, drafts, and published reads in Firestore.',
    canonicalUrl: '',
    createdAt: '2026-06-18T10:00:00.000Z',
    updatedAt: '2026-06-21T10:00:00.000Z',
    publishedAt: '2026-06-21T10:00:00.000Z',
  },
];

export const sampleSummaries: ArticleSummary[] = sampleArticles.map(
  ({ content: _content, ...rest }) => rest,
);

export function sampleArticleBySlug(slug: string): Article | undefined {
  return sampleArticles.find((article) => article.slug === slug && article.status === 'published');
}
