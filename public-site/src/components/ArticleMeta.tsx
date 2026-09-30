import { formatDate } from '../utils/dates';

type Props = {
  date?: string | null;
  readingTime?: number;
};

export function ArticleMeta({ date, readingTime }: Props) {
  return (
    <p className="text-[13px] uppercase tracking-[0.14em] text-public-muted">
      {date ? formatDate(date) : ''}
      {date && readingTime ? ' · ' : ''}
      {readingTime ? `${readingTime} min read` : ''}
    </p>
  );
}
