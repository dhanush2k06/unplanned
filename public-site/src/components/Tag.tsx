import { Link } from 'react-router-dom';

type Props = {
  label: string;
};

export function Tag({ label }: Props) {
  return (
    <Link
      to={`/search?q=${encodeURIComponent(label)}`}
      className="rounded-full border border-public-border px-3 py-1 text-xs text-public-muted transition hover:border-brand-red hover:text-brand-red"
    >
      {label}
    </Link>
  );
}
