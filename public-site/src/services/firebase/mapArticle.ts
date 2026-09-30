import type { Article, ArticleSummary } from '../../types';
import { toIso } from '../../utils/dates';

const SUMMARY_FIELDS = [
  'title',
  'slug',
  'excerpt',
  'coverImage',
  'status',
  'category',
  'categorySlug',
  'tags',
  'authorId',
  'authorName',
  'readingTime',
  'seoTitle',
  'seoDescription',
  'canonicalUrl',
  'createdAt',
  'updatedAt',
  'publishedAt',
] as const;

export const articleSummarySelectFields = [...SUMMARY_FIELDS];

export function mapArticle(id: string, data: Record<string, unknown>): Article {
  return {
    id,
    title: String(data.title ?? ''),
    slug: String(data.slug ?? ''),
    excerpt: String(data.excerpt ?? ''),
    content: String(data.content ?? ''),
    coverImage: String(data.coverImage ?? ''),
    status: (data.status as Article['status']) ?? 'draft',
    category: String(data.category ?? ''),
    categorySlug: String(data.categorySlug ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    authorId: String(data.authorId ?? ''),
    authorName: String(data.authorName ?? ''),
    readingTime: Number(data.readingTime ?? 1),
    seoTitle: String(data.seoTitle ?? data.title ?? ''),
    seoDescription: String(data.seoDescription ?? data.excerpt ?? ''),
    canonicalUrl: String(data.canonicalUrl ?? ''),
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    publishedAt: toIso(data.publishedAt),
  };
}

export function toSummary(article: Article): ArticleSummary {
  const { content: _content, ...summary } = article;
  return summary;
}
