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
    <footer className="mt-20 border-t border-public-border">
      <div className="page-shell flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-heading text-lg text-brand-gradient">{settings.siteName}</p>
          <p className="mt-2 max-w-md text-sm text-public-muted">{settings.siteDescription}</p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm text-public-muted md:items-end">
          <div className="flex gap-4">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
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
