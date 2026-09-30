export type ArticleStatus = 'draft' | 'published' | 'archived';

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: ArticleStatus;
  category: string;
  categorySlug: string;
  tags: string[];
  authorId: string;
  authorName: string;
  readingTime: number;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
};

export type ArticleSummary = Omit<Article, 'content'>;

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type SocialLinks = {
  github: string;
  linkedin: string;
  medium: string;
};

export type SiteSettings = {
  siteName: string;
  siteDescription: string;
  authorName: string;
  authorBio: string;
  profileImage: string;
  socialLinks: SocialLinks;
};

export type UserProfile = {
  name: string;
  email: string;
  role: 'admin';
  photoURL: string;
  createdAt: string | null;
};

export type ArticleDraftInput = Omit<
  Article,
  'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'authorId' | 'authorName'
> & {
  authorId?: string;
  authorName?: string;
  publishedAt?: string | null;
};
