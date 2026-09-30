import type { ArticleStatus } from '../types';

const labels: Record<ArticleStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

export function StatusBadge({ status }: { status: ArticleStatus }) {
  const tone =
    status === 'published'
      ? 'bg-green-50 text-green-700'
      : status === 'archived'
        ? 'bg-neutral-100 text-neutral-600'
        : 'bg-amber-50 text-amber-700';
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{labels[status]}</span>
  );
}
