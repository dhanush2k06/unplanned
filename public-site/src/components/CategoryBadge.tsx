import { Link } from 'react-router-dom';

type Props = {
  name: string;
  slug?: string;
};

export function CategoryBadge({ name, slug }: Props) {
  const inner = (
    <span className="text-[11px] uppercase tracking-[0.18em] text-brand-red">{name}</span>
  );
  if (!slug) return inner;
  return <Link to={`/category/${slug}`}>{inner}</Link>;
}
