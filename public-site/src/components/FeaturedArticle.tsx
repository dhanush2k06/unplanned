import { Link } from 'react-router-dom';
import type { ArticleSummary } from '../types';
import { ArticleMeta } from './ArticleMeta';
import { CategoryBadge } from './CategoryBadge';

type Props = {
  article: ArticleSummary;
};

export function FeaturedArticle({ article }: Props) {
  return (
    <article className="overflow-hidden rounded-[18px] border border-public-border bg-public-surface">
      <Link to={`/articles/${article.slug}`} className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
        <img
          src={article.coverImage || '/default_image.webp'}
          alt=""
          className="h-full min-h-[280px] w-full object-cover"
        />
        <div className="flex flex-col justify-center gap-4 p-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-public-muted">Featured</p>
          <CategoryBadge name={article.category} slug={article.categorySlug} />
          <h2 className="font-heading text-4xl leading-[1.05] tracking-tight md:text-5xl">
            {article.title}
          </h2>
          <p className="max-w-xl text-public-muted">{article.excerpt}</p>
          <ArticleMeta date={article.publishedAt} readingTime={article.readingTime} />
        </div>
      </Link>
    </article>
  );
}
