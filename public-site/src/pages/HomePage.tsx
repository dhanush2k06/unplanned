import { Link } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { FeaturedArticle } from '../components/FeaturedArticle';
import { Seo } from '../components/Seo';
import { EmptyState, ErrorState, SkeletonGrid } from '../components/States';
import { useCategories, usePublishedArticles, useSiteSettings } from '../hooks/useContent';

export function HomePage() {
  const { settings } = useSiteSettings();
  const { articles, loading, error } = usePublishedArticles(8);
  const { categories } = useCategories();
  const featured = articles[0];
  const latest = articles.slice(1, 5);

  return (
    <div>
      <Seo title={`${settings.siteName} — Notes`} description={settings.siteDescription} />
      <section className="bg-brand-gradient">
        <div className="page-shell py-20 md:py-28">
          <p className="text-[12px] uppercase tracking-[0.28em] text-white/80">Personal blog / notes</p>
          <h1 className="mt-6 max-w-4xl font-heading text-[clamp(42px,8vw,84px)] leading-[0.9] tracking-tight text-white">
            Build. Learn. Document.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85">
            Ideas, projects, experiments, and the things I am learning along the way.
          </p>
          <Link
            to="/articles"
            className="mt-8 inline-flex rounded-full bg-black/25 px-6 py-3 text-sm font-medium backdrop-blur transition hover:bg-black/40"
          >
            Explore articles
          </Link>
        </div>
      </section>

      <div className="page-shell space-y-16 py-16">
        {loading ? <SkeletonGrid /> : null}
        {error ? <ErrorState message={error} onRetry={() => window.location.reload()} /> : null}
        {!loading && !error && !featured ? (
          <EmptyState title="No articles published yet." detail="New writing will appear here." />
        ) : null}
        {featured ? <FeaturedArticle article={featured} /> : null}

        {latest.length > 0 ? (
          <section>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-heading text-3xl tracking-tight">Latest</h2>
              <Link to="/articles" className="text-sm text-public-muted transition hover:text-brand-red">
                All articles →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {latest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        ) : null}

        {categories.length > 0 ? (
          <section>
            <h2 className="font-heading text-3xl tracking-tight">Topics</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="rounded-full border border-public-border px-4 py-2 text-sm text-public-muted transition hover:border-brand-red hover:text-brand-red hover:bg-red-50"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-[18px] border border-public-border bg-public-surface p-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-public-muted">About</p>
          <h2 className="mt-3 font-heading text-3xl tracking-tight">A short note</h2>
          <p className="mt-4 max-w-2xl text-public-muted leading-relaxed">{settings.authorBio}</p>
          <Link to="/about" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand-red transition hover:gap-2">
            More about me →
          </Link>
        </section>
      </div>
    </div>
  );
}
