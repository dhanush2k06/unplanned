import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export function NotFoundPage() {
  return (
    <div className="page-shell py-24 text-center">
      <Seo title="Page not found" description="This page does not exist." />
      <p className="text-[11px] uppercase tracking-[0.2em] text-public-muted">404</p>
      <h1 className="mt-4 font-heading text-5xl">This page is not here.</h1>
      <p className="mt-4 text-public-muted">The link may be old, or the article is no longer published.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-brand-gradient px-5 py-3 text-sm">
        Back home
      </Link>
    </div>
  );
}
