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
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-public-border text-public-text transition hover:bg-public-surface md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open ? (
        <div className="border-t border-public-border bg-public-bg/95 px-6 py-6 backdrop-blur shadow-lg md:hidden">
          <div className="flex flex-col gap-4 text-base font-medium text-public-text">
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2 transition hover:text-brand-red ${isActive ? 'text-brand-red font-semibold' : 'text-public-text'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate('/search');
              }}
              className="mt-2 flex items-center justify-center gap-2 rounded-full border border-public-border py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-public-muted transition hover:border-brand-red hover:text-brand-red"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
