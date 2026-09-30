import { ArticleCard } from './ArticleCard';
import type { ArticleSummary } from '../types';

type Props = {
  articles: ArticleSummary[];
};

export function RelatedArticles({ articles }: Props) {
  if (articles.length === 0) return null;
  return (
    <section className="mt-16">
      <h2 className="font-heading text-3xl">Related</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
