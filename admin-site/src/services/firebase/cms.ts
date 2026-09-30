import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { Article, ArticleDraftInput, ArticleStatus, Category, SiteSettings } from '../../types';
import { getDb } from './config';
import { mapArticle } from './mapArticle';

const defaultCategories: Category[] = [
  { id: 'cat-ai', name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'AI, machine learning, and deep learning experiments' },
  { id: 'cat-projects', name: 'Projects', slug: 'projects', description: 'Technical deep-dives into applications I build' },
  { id: 'cat-web', name: 'Web Development', slug: 'web-development', description: 'Modern web architectures and frontend engineering' },
  { id: 'cat-prog', name: 'Programming', slug: 'programming', description: 'Software design, algorithms, and clean code' },
  { id: 'cat-learn', name: 'Learning', slug: 'learning', description: 'Concepts, lessons, and insights along the way' },
];

function asRecord(value: unknown): Record<string, unknown> {
  return (value ?? {}) as Record<string, unknown>;
}

export async function listArticles(): Promise<Article[]> {
  try {
    const snapshot = await getDocs(collection(getDb(), 'articles'));
    const items = snapshot.docs.map((item) => mapArticle(item.id, asRecord(item.data())));
    return items.sort((a, b) => {
      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return timeB - timeA;
    });
  } catch {
    return [];
  }
}

export async function getArticle(id: string): Promise<Article | null> {
  try {
    const snapshot = await getDoc(doc(getDb(), 'articles', id));
    if (!snapshot.exists()) return null;
    return mapArticle(snapshot.id, asRecord(snapshot.data()));
  } catch {
    return null;
  }
}

export async function slugTaken(slug: string, excludeId?: string): Promise<boolean> {
  try {
    const snapshot = await getDocs(query(collection(getDb(), 'articles'), where('slug', '==', slug), limit(5)));
    return snapshot.docs.some((item) => item.id !== excludeId);
  } catch {
    return false;
  }
}

export async function createArticle(
  input: ArticleDraftInput,
  author: { id: string; name: string },
): Promise<string> {
  const ref = await addDoc(collection(getDb(), 'articles'), {
    ...input,
    authorId: author.id,
    authorName: author.name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: input.status === 'published' ? serverTimestamp() : null,
  });
  return ref.id;
}

export async function updateArticle(
  id: string,
  input: Partial<ArticleDraftInput> & { status?: ArticleStatus },
): Promise<void> {
  const payload: Record<string, unknown> = {
    ...input,
    updatedAt: serverTimestamp(),
  };
  if (input.status === 'published' && input.publishedAt === undefined) {
    const current = await getArticle(id);
    if (!current?.publishedAt) {
      payload.publishedAt = serverTimestamp();
    }
  }
  if (input.status === 'draft' || input.status === 'archived') {
    if (input.publishedAt === null) {
      payload.publishedAt = null;
    }
  }
  await updateDoc(doc(getDb(), 'articles', id), payload);
}

export async function deleteArticle(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'articles', id));
}

export async function listCategories(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(collection(getDb(), 'categories'));
    if (snapshot.empty) {
      return defaultCategories;
    }
    return snapshot.docs
      .map((item) => {
        const data = asRecord(item.data());
        return {
          id: item.id,
          name: String(data.name ?? ''),
          slug: String(data.slug ?? ''),
          description: String(data.description ?? ''),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return defaultCategories;
  }
}

export async function saveCategory(category: Omit<Category, 'id'> & { id?: string }): Promise<void> {
  const id = category.id ?? crypto.randomUUID();
  await setDoc(doc(getDb(), 'categories', id), {
    name: category.name,
    slug: category.slug,
    description: category.description,
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'categories', id));
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const snapshot = await getDoc(doc(getDb(), 'settings', 'site'));
    if (!snapshot.exists()) return null;
    const data = asRecord(snapshot.data());
    const social = asRecord(data.socialLinks);
    return {
      siteName: String(data.siteName ?? ''),
      siteDescription: String(data.siteDescription ?? ''),
      authorName: String(data.authorName ?? ''),
      authorBio: String(data.authorBio ?? ''),
      profileImage: String(data.profileImage ?? ''),
      socialLinks: {
        github: String(social.github ?? ''),
        linkedin: String(social.linkedin ?? ''),
        medium: String(social.medium ?? ''),
      },
    };
  } catch {
    return null;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await setDoc(doc(getDb(), 'settings', 'site'), settings, { merge: true });
}
