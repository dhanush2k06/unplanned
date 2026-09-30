import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  initial?: string;
};

export function SearchBar({ initial = '' }: Props) {
  const [value, setValue] = useState(initial);
  const navigate = useNavigate();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const query = value.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-3">
      <label className="sr-only" htmlFor="search">
        Search articles
      </label>
      <input
        id="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search titles, tags, topics"
        className="w-full rounded-full border border-public-border bg-public-surface px-5 py-3 text-sm text-white placeholder:text-public-muted"
      />
      <button type="submit" className="rounded-full bg-brand-gradient px-5 py-3 text-sm font-medium text-white">
        Search
      </button>
    </form>
  );
}
