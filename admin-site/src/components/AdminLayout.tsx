import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import logo from '../assets/unplanned_logo.png';

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      {/* Mobile Top Navigation Header */}
      <div className="flex h-14 items-center justify-between border-b border-admin-border bg-white px-4 md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-admin-border text-admin-text transition hover:bg-admin-bg"
            aria-label="Open sidebar menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img src={logo} alt="Unplanned" className="-my-3 h-12 w-auto object-contain" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-red">Admin CMS</span>
      </div>

      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
