import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { Topbar } from '../components/Topbar';
import { listArticles } from '../services/firebase/cms';
import type { Article } from '../types';
import { formatDate } from '../utils/dates';

export function DashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await listArticles();
        if (mounted) {
          setArticles(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const total = articles.length;
  const published = articles.filter((a) => a.status === 'published').length;
  const drafts = articles.filter((a) => a.status === 'draft').length;
  const archived = articles.filter((a) => a.status === 'archived').length;
  const recentArticles = articles.slice(0, 6);

  return (
    <div className="min-h-full bg-admin-bg pb-12">
      <Topbar
        title="Dashboard"
        action={
          <Link
            to="/articles/new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            <span>+</span>
            <span>New Article</span>
          </Link>
        }
      />

      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-white/80 p-5 shadow-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p className="font-semibold">Error loading dashboard</p>
            <p className="mt-1">{error}</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Articles" value={total} />
              <StatCard label="Published" value={published} />
              <StatCard label="Drafts" value={drafts} />
              <StatCard label="Archived" value={archived} />
            </div>

            {/* Quick Actions & Recent Content */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Recent Articles Table */}
              <div className="rounded-xl border border-admin-border bg-white shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between border-b border-admin-border px-6 py-4">
                  <h2 className="font-heading text-base font-semibold text-admin-text">
                    Recent Articles
                  </h2>
                  <Link
                    to="/articles"
                    className="text-xs font-semibold text-brand-red transition hover:underline"
                  >
                    View all ({total}) →
                  </Link>
                </div>

                {recentArticles.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm text-admin-muted">You haven't written any articles yet.</p>
                    <Link
                      to="/articles/new"
                      className="mt-4 inline-block rounded-lg bg-brand-gradient px-4 py-2 text-xs font-semibold text-white"
                    >
                      Write Your First Article
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-admin-border overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-admin-bg/50 text-xs text-admin-muted">
                          <th className="px-6 py-3 font-medium">Title</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                          <th className="px-6 py-3 font-medium">Category</th>
                          <th className="px-6 py-3 font-medium">Updated</th>
                          <th className="px-6 py-3 text-right font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-admin-border">
                        {recentArticles.map((article) => (
                          <tr key={article.id} className="transition hover:bg-admin-bg/40">
                            <td className="max-w-[220px] truncate px-6 py-3.5 font-medium text-admin-text">
                              <Link
                                to={`/articles/${article.id}/edit`}
                                className="hover:text-brand-red"
                              >
                                {article.title || 'Untitled Article'}
                              </Link>
                            </td>
                            <td className="px-6 py-3.5">
                              <StatusBadge status={article.status} />
                            </td>
                            <td className="px-6 py-3.5 text-xs text-admin-muted">
                              {article.category || '—'}
                            </td>
                            <td className="px-6 py-3.5 text-xs text-admin-muted">
                              {formatDate(article.updatedAt || article.createdAt)}
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <Link
                                to={`/articles/${article.id}/edit`}
                                className="inline-flex rounded border border-admin-border bg-white px-2.5 py-1 text-xs font-medium text-admin-text shadow-sm hover:border-brand-red hover:text-brand-red"
                              >
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Sidebar Quick Cards */}
              <div className="space-y-6">
                <div className="rounded-xl border border-admin-border bg-white p-6 shadow-sm">
                  <h2 className="font-heading text-base font-semibold text-admin-text">
                    Publishing Studio
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-admin-muted">
                    Welcome to your central editorial workspace. Write drafts with rich Markdown, manage SEO metadata, and publish articles seamlessly to your public publication.
                  </p>
                  <div className="mt-5 space-y-2">
                    <Link
                      to="/articles/new"
                      className="block w-full rounded-lg bg-admin-bg px-4 py-2.5 text-center text-xs font-semibold text-admin-text transition hover:bg-neutral-200"
                    >
                      + Create New Article
                    </Link>
                    <Link
                      to="/categories"
                      className="block w-full rounded-lg border border-admin-border px-4 py-2.5 text-center text-xs font-medium text-admin-text transition hover:bg-admin-bg"
                    >
                      Manage Categories
                    </Link>
                    <Link
                      to="/settings"
                      className="block w-full rounded-lg border border-admin-border px-4 py-2.5 text-center text-xs font-medium text-admin-text transition hover:bg-admin-bg"
                    >
                      Site Settings
                    </Link>
                  </div>
                </div>

                <div className="rounded-xl border border-admin-border bg-white p-6 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-admin-muted">
                    Workflow Tip
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-admin-muted">
                    Articles saved as <strong className="text-amber-700">Draft</strong> are fully protected and never visible to the public. You can preview formatting live in split-view before hitting publish.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
