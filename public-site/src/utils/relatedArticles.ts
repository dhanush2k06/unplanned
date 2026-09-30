import type { ArticleSummary } from '../types';

export function scoreRelated(
  current: Pick<ArticleSummary, 'id' | 'category' | 'tags' | 'publishedAt'>,
  candidate: ArticleSummary,
): number {
  if (candidate.id === current.id) return -Infinity;
  let score = 0;
  if (candidate.category && candidate.category === current.category) score += 3;
  for (const tag of candidate.tags ?? []) {
    if (current.tags?.includes(tag)) score += 1;
  }
  if (candidate.publishedAt) {
    const ageDays =
      (Date.now() - new Date(candidate.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays <= 45) score += 1;
  }
  return score;
}

export function pickRelated(
  current: Pick<ArticleSummary, 'id' | 'category' | 'tags' | 'publishedAt'>,
  articles: ArticleSummary[],
  limit = 3,
): ArticleSummary[] {
  return [...articles]
    .map((article) => ({ article, score: scoreRelated(current, article) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.article);
}
