import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import {
  defaultSettings,
  sampleArticleBySlug,
  sampleCategories,
  sampleSummaries,
} from '../../data/sample';
import type { Article, ArticleSummary, Category, SiteSettings } from '../../types';
import { getDb, isFirebaseConfigured } from './config';
import { mapArticle, toSummary } from './mapArticle';

const PAGE_SIZE = 12;

function asRecord(value: unknown): Record<string, unknown> {
  return (value ?? {}) as Record<string, unknown>;
}

export async function fetchPublishedSummaries(max = PAGE_SIZE): Promise<ArticleSummary[]> {
  if (!isFirebaseConfigured()) {
    return sampleSummaries.slice(0, max);
  }

  const articlesQuery = query(
    collection(getDb(), 'articles'),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc'),
    limit(max),
  );
  const snapshot = await getDocs(articlesQuery);
  return snapshot.docs.map((item) => toSummary(mapArticle(item.id, asRecord(item.data()))));
}

export async function fetchPublishedByCategory(
  categorySlug: string,
  max = 24,
): Promise<ArticleSummary[]> {
  if (!isFirebaseConfigured()) {
    return sampleSummaries.filter((article) => article.categorySlug === categorySlug);
  }

  const articlesQuery = query(
    collection(getDb(), 'articles'),
    where('status', '==', 'published'),
    where('categorySlug', '==', categorySlug),
    orderBy('publishedAt', 'desc'),
    limit(max),
  );
  const snapshot = await getDocs(articlesQuery);
  return snapshot.docs.map((item) => toSummary(mapArticle(item.id, asRecord(item.data()))));
}

export async function fetchPublishedArticleBySlug(slug: string): Promise<Article | null> {
  if (!isFirebaseConfigured()) {
    return sampleArticleBySlug(slug) ?? null;
  }

  const articlesQuery = query(
    collection(getDb(), 'articles'),
    where('status', '==', 'published'),
    where('slug', '==', slug),
    limit(1),
  );
  const snapshot = await getDocs(articlesQuery);
  const first = snapshot.docs[0];
  if (!first) return null;
  const article = mapArticle(first.id, asRecord(first.data()));
  if (article.status !== 'published') return null;
  return article;
}

export async function fetchCategories(): Promise<Category[]> {
  if (!isFirebaseConfigured()) return sampleCategories;

  const snapshot = await getDocs(collection(getDb(), 'categories'));
  const categories = snapshot.docs.map((item) => {
    const data = asRecord(item.data());
    return {
      id: item.id,
      name: String(data.name ?? ''),
      slug: String(data.slug ?? ''),
      description: String(data.description ?? ''),
    };
  });
  return categories.sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!isFirebaseConfigured()) return defaultSettings;

  const snapshot = await getDoc(doc(getDb(), 'settings', 'site'));
  if (!snapshot.exists()) return defaultSettings;
  const data = asRecord(snapshot.data());
  const social = asRecord(data.socialLinks);
  return {
    siteName: String(data.siteName ?? defaultSettings.siteName),
    siteDescription: String(data.siteDescription ?? defaultSettings.siteDescription),
    authorName: String(data.authorName ?? defaultSettings.authorName),
    authorBio: String(data.authorBio ?? defaultSettings.authorBio),
    profileImage: String(data.profileImage ?? ''),
    socialLinks: {
      github: String(social.github ?? ''),
      linkedin: String(social.linkedin ?? ''),
      medium: String(social.medium ?? ''),
    },
  };
}
