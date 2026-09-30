import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { SearchBar } from '../components/SearchBar';
import { Seo } from '../components/Seo';
import { EmptyState, ErrorState, SkeletonGrid } from '../components/States';
import { usePublishedArticles } from '../hooks/useContent';

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const { articles, loading, error } = usePublishedArticles(80);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return articles;
    return articles.filter((article) => {
      const haystack = [
        article.title,
        article.excerpt,
        article.category,
        ...article.tags,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [articles, q]);

  return (
    <div className="page-shell py-12">
      <Seo title={q ? `Search: ${q}` : 'Search'} description="Search published articles." />
      <h1 className="font-heading text-5xl tracking-tight">Search</h1>
      <div className="mt-8 max-w-xl">
        <SearchBar initial={q} />
      </div>
      <div className="mt-10">
        {loading ? <SkeletonGrid /> : null}
        {error ? <ErrorState message={error} onRetry={() => window.location.reload()} /> : null}
        {!loading && results.length === 0 ? (
          <EmptyState title="No matching articles." detail="Try a different title, tag, or topic." />
        ) : null}
        <div className="grid gap-6 md:grid-cols-2">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
