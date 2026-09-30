import type { Article } from '../types';
import { ArticleMeta } from './ArticleMeta';
import { CategoryBadge } from './CategoryBadge';

type Props = {
  article: Article;
};

export function ArticleHeader({ article }: Props) {
  return (
    <header className="space-y-5">
      <CategoryBadge name={article.category} slug={article.categorySlug} />
      <h1 className="font-heading text-[clamp(36px,6vw,64px)] leading-[0.95] tracking-tight">
        {article.title}
      </h1>
      <p className="max-w-2xl text-lg text-public-muted">{article.excerpt}</p>
      <ArticleMeta date={article.publishedAt} readingTime={article.readingTime} />
      {article.coverImage ? (
        <img
          src={article.coverImage}
          alt=""
          className="mt-6 w-full rounded-[18px] object-cover"
        />
      ) : null}
    </header>
  );
}
