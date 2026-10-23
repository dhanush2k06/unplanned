import { Seo } from '../components/Seo';
import { useSiteSettings } from '../hooks/useContent';
import profileImg from '../assets/profile_blog.jpeg';

const linkConfig: Record<string, { icon: JSX.Element; accent: string }> = {
  GitHub: {
    accent: '#24292f',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.51.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.021C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  LinkedIn: {
    accent: '#0a66c2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  Medium: {
    accent: '#1a8917',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
  Portfolio: {
    accent: '#e00000',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
};

export function AboutPage() {
  const { settings } = useSiteSettings();
  const links = [
    { href: settings.socialLinks.github, label: 'GitHub' },
    { href: settings.socialLinks.linkedin, label: 'LinkedIn' },
    { href: settings.socialLinks.medium, label: 'Medium' },
    { href: 'https://professional-portfolio-dhanush.vercel.app/', label: 'Portfolio' },
  ].filter((link) => link.href);

  return (
    <div className="page-shell py-10 sm:py-16">
      <Seo title={`About ${settings.authorName}`} description={settings.authorBio} />
      <div className="flex flex-col items-center gap-8 text-center sm:text-left md:grid md:items-start md:gap-10 md:grid-cols-[240px_1fr]">
        <div className="w-44 shrink-0 sm:w-56 md:w-full">
          <img
            src={profileImg}
            alt={settings.authorName}
            className="aspect-square w-full rounded-[18px] object-cover shadow-sm"
          />
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

          {/* Stylish reference link tags */}
          <div className="mt-8 flex flex-wrap justify-center sm:justify-start gap-3">
            {links.map((link) => {
              const config = linkConfig[link.label];
              const accent = config?.accent ?? '#e00000';
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-tag group"
                  style={{ '--tag-accent': accent } as React.CSSProperties}
                >
                  <span className="social-tag__icon">{config?.icon}</span>
                  <span className="social-tag__label">{link.label}</span>
                  <span className="social-tag__arrow">↗</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
