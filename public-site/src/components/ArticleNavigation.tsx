import { Link } from 'react-router-dom';
import type { ArticleSummary } from '../types';

type Props = {
  previous?: ArticleSummary | null;
  next?: ArticleSummary | null;
};

export function ArticleNavigation({ previous, next }: Props) {
  if (!previous && !next) return null;
  return (
    <nav className="mt-16 grid gap-4 border-t border-public-border pt-8 md:grid-cols-2">
      {previous ? (
        <Link to={`/articles/${previous.slug}`} className="rounded-[14px] border border-public-border p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-public-muted">Previous</p>
          <p className="mt-2 font-heading text-xl">{previous.title}</p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={`/articles/${next.slug}`}
          className="rounded-[14px] border border-public-border p-5 md:text-right"
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-public-muted">Next</p>
          <p className="mt-2 font-heading text-xl">{next.title}</p>
        </Link>
      ) : null}
    </nav>
  );
}
