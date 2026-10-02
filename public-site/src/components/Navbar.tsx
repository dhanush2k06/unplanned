import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/unplanned_logo.png';

const links = [
  { to: '/articles', label: 'Articles' },
  { to: '/articles', label: 'Topics', hash: true },
  { to: '/about', label: 'About' },
];

type Props = {
  siteName?: string;
};

export function Navbar({ siteName: _siteName }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-public-border bg-public-bg/90 backdrop-blur">
      <div className="page-shell flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Unplanned Home">
          <img src={logo} alt="Unplanned" className="-my-4 h-16 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-public-muted md:flex">
          <NavLink
            to="/articles"
            className={({ isActive }) =>
              isActive ? 'text-public-text font-medium' : 'transition hover:text-public-text'
            }
          >
            Articles
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'text-public-text font-medium' : 'transition hover:text-public-text'
            }
          >
            About
          </NavLink>
          <button
            type="button"
            aria-label="Search articles"
            onClick={() => navigate('/search')}
            className="rounded-full border border-public-border px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-public-muted transition hover:border-brand-red hover:text-brand-red"
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
            <span className="h-px bg-public-text" />
            <span className="h-px bg-public-text" />
            <span className="h-px bg-public-text" />
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
