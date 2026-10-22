import { useState } from 'react';
import { ArticleCard } from '../components/ArticleCard';
import { FeaturedArticle } from '../components/FeaturedArticle';
import { Seo } from '../components/Seo';
import { EmptyState, ErrorState, SkeletonGrid } from '../components/States';
import { usePublishedArticles } from '../hooks/useContent';

export function ArticlesPage() {
  const { articles, loading, error } = usePublishedArticles(50);
  const [visible, setVisible] = useState(9);

  const featured = articles[0];
  const rest = articles.slice(1, visible);

  return (
    <div className="page-shell py-12">
      <Seo title="Articles" description="All published writing and personal thoughts." />
      
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl sm:text-5xl tracking-tight">Articles</h1>
        <p className="mt-3 text-base sm:text-lg text-public-muted">
          All published writing and thoughts.
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {loading ? <SkeletonGrid /> : null}
        {error ? <ErrorState message={error} onRetry={() => window.location.reload()} /> : null}
        {!loading && !error && !featured ? (
          <EmptyState title="No articles published yet." detail="Check back soon for new articles." />
        ) : null}

        {featured ? <FeaturedArticle article={featured} /> : null}

        {rest.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : null}

        {articles.length > visible ? (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => setVisible((value) => value + 6)}
              className="rounded-full border border-public-border px-6 py-2.5 text-sm font-medium text-public-muted transition hover:border-brand-red hover:text-brand-red"
            >
              Load more
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
