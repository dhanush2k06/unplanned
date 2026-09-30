import { Link } from 'react-router-dom';
import type { ArticleSummary } from '../types';
import { ArticleMeta } from './ArticleMeta';
import { CategoryBadge } from './CategoryBadge';

type Props = {
  article: ArticleSummary;
};

export function ArticleCard({ article }: Props) {
  return (
    <article className="group overflow-hidden rounded-[14px] border border-public-border bg-public-surface transition duration-200 hover:-translate-y-0.5 hover:border-brand-red">
      <Link to={`/articles/${article.slug}`} className="block">
        {article.coverImage ? (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={article.coverImage}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-brand-gradient opacity-80" />
        )}
        <div className="space-y-3 p-5">
          <CategoryBadge name={article.category} slug={article.categorySlug} />
          <h3 className="font-heading text-2xl leading-tight transition group-hover:text-brand-red">
            {article.title}
          </h3>
          <p className="text-sm text-public-muted">{article.excerpt}</p>
          <ArticleMeta date={article.publishedAt} readingTime={article.readingTime} />
        </div>
      </Link>
    </article>
  );
}
