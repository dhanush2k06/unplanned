import { Link } from 'react-router-dom';
import type { ArticleSummary } from '../types';
import { ArticleMeta } from './ArticleMeta';
import { CategoryBadge } from './CategoryBadge';

type Props = {
  article: ArticleSummary;
};

export function FeaturedArticle({ article }: Props) {
  return (
    <article className="overflow-hidden rounded-[16px] sm:rounded-[18px] border border-public-border bg-public-surface">
      <Link to={`/articles/${article.slug}`} className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
        <div className="h-56 w-full sm:h-72 md:h-full">
          <img
            src={article.coverImage || '/default_image.webp'}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-3 sm:gap-4 p-5 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-public-muted">Featured</p>
          <CategoryBadge name={article.category} slug={article.categorySlug} />
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
            {article.title}
          </h2>
          <p className="max-w-xl text-sm sm:text-base text-public-muted line-clamp-3">{article.excerpt}</p>
          <ArticleMeta date={article.publishedAt} readingTime={article.readingTime} />
        </div>
      </Link>
    </article>
  );
}
