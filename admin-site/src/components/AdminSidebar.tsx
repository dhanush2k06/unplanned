import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/unplanned_logo.png';

const items = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/articles', label: 'All Articles' },
  { to: '/articles/new', label: 'New Article' },
  { to: '/categories', label: 'Categories' },
  { to: '/settings', label: 'Settings' },
];

type Props = {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
};

export function AdminSidebar({ mobileOpen, onCloseMobile }: Props) {
  const { logout, profile } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-admin-border bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <div>
            <img src={logo} alt="Unplanned" className="-ml-1 -my-4 h-16 w-auto object-contain" />
            <p className="mt-2 text-xs text-admin-muted">{profile?.name || 'Admin'}</p>
          </div>
          {onCloseMobile ? (
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg md:hidden"
              aria-label="Close navigation"
            >
              ✕
            </button>
          ) : null}
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-[#fff1f1] text-brand-red font-semibold' : 'text-admin-muted hover:bg-admin-bg hover:text-admin-text'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            void logout();
          }}
          className="m-4 rounded-lg border border-admin-border px-3 py-2 text-left text-sm text-admin-muted transition hover:bg-red-50 hover:text-red-600"
        >
          Logout
        </button>
      </aside>
    </>
  );
}
