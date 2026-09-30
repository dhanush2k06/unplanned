import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const items = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/articles', label: 'All Articles' },
  { to: '/articles/new', label: 'New Article' },
  { to: '/categories', label: 'Categories' },
  { to: '/settings', label: 'Settings' },
];

export function AdminSidebar() {
  const { logout, profile } = useAuth();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-admin-border bg-white">
      <div className="px-5 py-6">
        <p className="font-heading text-lg text-brand-gradient">Studio</p>
        <p className="mt-1 text-xs text-admin-muted">{profile?.name || 'Admin'}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${
                isActive ? 'bg-[#fff1f1] text-brand-red' : 'text-admin-muted hover:bg-admin-bg hover:text-admin-text'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        onClick={() => void logout()}
        className="m-4 rounded-lg border border-admin-border px-3 py-2 text-left text-sm text-admin-muted"
      >
        Logout
      </button>
    </aside>
  );
}
