import { useParams } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { Seo } from '../components/Seo';
import { EmptyState, ErrorState, SkeletonGrid } from '../components/States';
import { useCategories, usePublishedArticles } from '../hooks/useContent';

export function CategoryPage() {
  const { slug = '' } = useParams();
  const { articles, loading, error } = usePublishedArticles(40);
  const { categories } = useCategories();
  const category = categories.find((item) => item.slug === slug);
  const filtered = articles.filter((article) => article.categorySlug === slug);
  const title = category?.name ?? 'Category';

  return (
    <div className="page-shell py-12">
      <Seo title={title} description={category?.description || `Articles in ${title}.`} />
      <p className="text-[11px] uppercase tracking-[0.2em] text-public-muted">Category</p>
      <h1 className="mt-3 font-heading text-5xl tracking-tight">{title}</h1>
      {category?.description ? <p className="mt-4 max-w-2xl text-public-muted">{category.description}</p> : null}

      <div className="mt-10">
        {loading ? <SkeletonGrid /> : null}
        {error ? <ErrorState message={error} onRetry={() => window.location.reload()} /> : null}
        {!loading && filtered.length === 0 ? <EmptyState title="No articles in this topic yet." /> : null}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
