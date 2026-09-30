import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const links = [
  { to: '/articles', label: 'Articles' },
  { to: '/articles', label: 'Topics', hash: true },
  { to: '/about', label: 'About' },
];

type Props = {
  siteName: string;
};

export function Navbar({ siteName }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-public-border bg-public-bg/90 backdrop-blur">
      <div className="page-shell flex h-16 items-center justify-between">
        <Link to="/" className="font-heading text-lg font-semibold tracking-tight">
          <span className="text-brand-gradient">{siteName}</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-public-muted md:flex">
          <NavLink
            to="/articles"
            className={({ isActive }) =>
              isActive ? 'text-white' : 'transition hover:text-white'
            }
          >
            Articles
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'text-white' : 'transition hover:text-white'
            }
          >
            About
          </NavLink>
          <button
            type="button"
            aria-label="Search articles"
            onClick={() => navigate('/search')}
            className="rounded-full border border-public-border px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-public-muted transition hover:border-brand-red hover:text-white"
          >
            Search
          </button>
        </nav>

        <button
          type="button"
          className="md:hidden"
          aria-expanded={open}
          aria-label="Open menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex h-5 w-6 flex-col justify-between">
            <span className="h-px bg-white" />
            <span className="h-px bg-white" />
            <span className="h-px bg-white" />
          </span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-public-border bg-public-bg px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm">
            {links.map((link) => (
              <Link key={link.label} to={link.to} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link to="/search" onClick={() => setOpen(false)}>
              Search
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
