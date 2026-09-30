import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArticleHeader } from '../components/ArticleHeader';
import { ArticleNavigation } from '../components/ArticleNavigation';
import { ReadingProgress } from '../components/ReadingProgress';
import { RelatedArticles } from '../components/RelatedArticles';
import { Seo } from '../components/Seo';
import { Tag } from '../components/Tag';
import { EmptyState, ErrorState, SkeletonGrid } from '../components/States';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { fetchPublishedArticleBySlug, fetchPublishedSummaries } from '../services/firebase/content';
import type { Article, ArticleSummary } from '../types';
import { pickRelated } from '../utils/relatedArticles';
import { useSiteSettings } from '../hooks/useContent';

export function ArticlePage() {
  const { slug = '' } = useParams();
  const { settings } = useSiteSettings();
  const [article, setArticle] = useState<Article | null>(null);
  const [summaries, setSummaries] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([fetchPublishedArticleBySlug(slug), fetchPublishedSummaries(40)])
      .then(([found, list]) => {
        if (!active) return;
        setArticle(found);
        setSummaries(list);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Unable to load article.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const neighbors = useMemo(() => {
    const ordered = [...summaries].sort((a, b) =>
      (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''),
    );
    const index = ordered.findIndex((item) => item.slug === slug);
    return {
      previous: index >= 0 ? ordered[index + 1] : null,
      next: index > 0 ? ordered[index - 1] : null,
    };
  }, [summaries, slug]);

  const related = useMemo(() => {
    if (!article) return [];
    return pickRelated(article, summaries, 3);
  }, [article, summaries]);

  if (loading) {
    return (
      <div className="page-shell py-16">
        <SkeletonGrid message="Loading article..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell py-16">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="page-shell py-16">
        <EmptyState title="Article not found." detail="It may be unpublished or the link is incorrect." />
      </div>
    );
  }

  const origin = window.location.origin;
  const canonical = article.canonicalUrl || `${origin}/articles/${article.slug}`;
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;

  return (
    <article>
      <ReadingProgress />
      <Seo
        title={title}
        description={description}
        canonical={canonical}
        image={article.coverImage || undefined}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description,
          image: article.coverImage || undefined,
          author: { '@type': 'Person', name: article.authorName || settings.authorName },
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          mainEntityOfPage: canonical,
        }}
      />
      <div className="page-shell py-12">
        <div className="mx-auto max-w-[760px]">
          <ArticleHeader article={article} />
          <div className="mt-12">
            <MarkdownRenderer content={article.content} />
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
          <ArticleNavigation previous={neighbors.previous} next={neighbors.next} />
        </div>
        <RelatedArticles articles={related} />
      </div>
    </article>
  );
}
