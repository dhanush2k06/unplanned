import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { useSiteSettings } from '../hooks/useContent';

export function PublicLayout() {
  const { settings } = useSiteSettings();
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar siteName={settings.siteName} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
