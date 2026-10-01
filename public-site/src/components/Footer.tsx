import logo from '../assets/unplanned_logo.png';
import type { SiteSettings } from '../types';

type Props = {
  settings: SiteSettings;
};

export function Footer({ settings }: Props) {
  const year = new Date().getFullYear();
  const links = [
    { href: settings.socialLinks.github, label: 'GitHub' },
    { href: settings.socialLinks.linkedin, label: 'LinkedIn' },
    { href: settings.socialLinks.medium, label: 'Medium' },
  ].filter((link) => link.href);

  return (
    <footer className="mt-20 border-t border-public-border bg-public-surface">
      <div className="page-shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <img src={logo} alt="Unplanned" className="-ml-3 -my-2 h-12 w-auto object-contain" />
          <p className="mt-2 max-w-md text-sm text-public-muted leading-relaxed">{settings.siteDescription}</p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm text-public-muted md:items-end">
          <div className="flex gap-5">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-brand-red"
              >
                {link.label}
              </a>
            ))}
          </div>
          <p>© {year} {settings.authorName}</p>
        </div>
      </div>
    </footer>
  );
}
