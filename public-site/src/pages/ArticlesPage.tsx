import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { FeaturedArticle } from '../components/FeaturedArticle';
import { SearchBar } from '../components/SearchBar';
import { Seo } from '../components/Seo';
import { EmptyState, ErrorState, SkeletonGrid } from '../components/States';
import { useCategories, usePublishedArticles } from '../hooks/useContent';

export function ArticlesPage() {
  const { articles, loading, error } = usePublishedArticles(40);
  const { categories } = useCategories();
  const [activeSlug, setActiveSlug] = useState<string | 'all'>('all');
  const [visible, setVisible] = useState(7);

  const filtered = useMemo(() => {
    if (activeSlug === 'all') return articles;
    return articles.filter((article) => article.categorySlug === activeSlug);
  }, [articles, activeSlug]);

  const featured = filtered[0];
  const rest = filtered.slice(1, visible);

  return (
    <div className="page-shell py-12">
      <Seo title="Articles" description="All published writing, notes, and project logs." />
      <h1 className="font-heading text-5xl tracking-tight">Articles</h1>
      <div className="mt-8 max-w-xl">
        <SearchBar />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSlug('all')}
          className={`rounded-full border px-4 py-2 text-sm ${
            activeSlug === 'all' ? 'border-brand-red text-white' : 'border-public-border text-public-muted'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveSlug(category.slug)}
            className={`rounded-full border px-4 py-2 text-sm ${
              activeSlug === category.slug
                ? 'border-brand-red text-white'
                : 'border-public-border text-public-muted'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {loading ? <SkeletonGrid /> : null}
        {error ? <ErrorState message={error} onRetry={() => window.location.reload()} /> : null}
        {!loading && !featured ? <EmptyState title="No articles published yet." /> : null}
        {featured ? <FeaturedArticle article={featured} /> : null}
        {rest.length > 0 ? (
          <div className="divide-y divide-public-border border-y border-public-border">
            {rest.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className="flex flex-col gap-2 py-6 transition hover:text-brand-red md:flex-row md:items-baseline md:justify-between"
              >
                <h2 className="font-heading text-2xl">{article.title}</h2>
                <p className="text-sm text-public-muted">{article.category}</p>
              </Link>
            ))}
          </div>
        ) : null}
        {filtered.length > visible ? (
          <button
            type="button"
            onClick={() => setVisible((value) => value + 6)}
            className="rounded-full border border-public-border px-5 py-2 text-sm"
          >
            Load more
          </button>
        ) : null}
        {rest.length === 0 && featured ? (
          <div className="grid gap-6 md:grid-cols-2">
            <ArticleCard article={featured} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
