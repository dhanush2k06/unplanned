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
    <div className="page-shell py-10 sm:py-16">
      <Seo title={`About ${settings.authorName}`} description={settings.authorBio} />
      <div className="flex flex-col items-center gap-8 text-center sm:text-left md:grid md:items-start md:gap-10 md:grid-cols-[240px_1fr]">
        <div className="w-44 shrink-0 sm:w-56 md:w-full">
          {settings.profileImage ? (
            <img
              src={settings.profileImage}
              alt={settings.authorName}
              className="aspect-square w-full rounded-[18px] object-cover shadow-sm"
            />
          ) : (
            <div className="aspect-square w-full rounded-[18px] bg-brand-gradient shadow-sm" />
          )}
        </div>
        <div className="w-full">
          <p className="text-[11px] uppercase tracking-[0.2em] text-public-muted">About</p>
          <h1 className="mt-2 font-heading text-3xl sm:text-4xl md:text-5xl tracking-tight">Hi, I&apos;m {settings.authorName}.</h1>
          <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-public-muted">{settings.authorBio}</p>
          <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-2.5">
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
