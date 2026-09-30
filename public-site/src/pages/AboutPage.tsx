import { Seo } from '../components/Seo';
import { useSiteSettings } from '../hooks/useContent';

export function AboutPage() {
  const { settings } = useSiteSettings();
  const links = [
    { href: settings.socialLinks.github, label: 'GitHub' },
    { href: settings.socialLinks.linkedin, label: 'LinkedIn' },
    { href: settings.socialLinks.medium, label: 'Medium' },
  ].filter((link) => link.href);

  return (
    <div className="page-shell py-16">
      <Seo title={`About ${settings.authorName}`} description={settings.authorBio} />
      <div className="grid items-start gap-10 md:grid-cols-[240px_1fr]">
        {settings.profileImage ? (
          <img
            src={settings.profileImage}
            alt={settings.authorName}
            className="aspect-square w-full rounded-[18px] object-cover"
          />
        ) : (
          <div className="aspect-square rounded-[18px] bg-brand-gradient" />
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-public-muted">About</p>
          <h1 className="mt-3 font-heading text-5xl tracking-tight">Hi, I&apos;m {settings.authorName}.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-public-muted">{settings.authorBio}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {['AI', 'Data', 'Software', 'Products'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-public-border px-4 py-2 text-sm text-public-muted"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-8 flex gap-4 text-sm">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="text-brand-red">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
