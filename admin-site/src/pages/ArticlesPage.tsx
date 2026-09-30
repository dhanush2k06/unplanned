import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge } from '../components/StatusBadge';
import { Topbar } from '../components/Topbar';
import { useToast } from '../hooks/useToast';
import { deleteArticle, listArticles, listCategories, updateArticle } from '../services/firebase/cms';
import type { Article, ArticleStatus, Category } from '../types';
import { formatDate } from '../utils/dates';

export function ArticlesPage() {
  const { notify } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ArticleStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'published' | 'title'>('updated');

  // Delete modal state
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [articleList, catList] = await Promise.all([listArticles(), listCategories()]);
        if (mounted) {
          setArticles(articleList);
          setCategories(catList);
          setError(null);
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch articles.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void loadData();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleToggleStatus(article: Article, nextStatus: ArticleStatus) {
    try {
      await updateArticle(article.id, { status: nextStatus });
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, status: nextStatus } : a)),
      );
      notify(`Article status changed to ${nextStatus}.`);
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : 'Status update failed.');
    }
  }

  async function handleConfirmDelete() {
    if (!articleToDelete) return;
    setDeleting(true);
    try {
      await deleteArticle(articleToDelete.id);
      setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
      notify('Article deleted successfully.');
      setArticleToDelete(null);
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : 'Failed to delete article.');
    } finally {
      setDeleting(false);
    }
  }

  const filteredArticles = useMemo(() => {
    return articles
      .filter((article) => {
        if (statusFilter !== 'all' && article.status !== statusFilter) return false;
        if (categoryFilter !== 'all' && article.category !== categoryFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = article.title.toLowerCase().includes(q);
          const matchExcerpt = article.excerpt.toLowerCase().includes(q);
          const matchCategory = article.category.toLowerCase().includes(q);
          const matchTags = article.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchExcerpt && !matchCategory && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'published') {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return dateB - dateA;
        }
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [articles, statusFilter, categoryFilter, search, sortBy]);

  return (
    <div className="min-h-full bg-admin-bg pb-12">
      <Topbar
        title="All Articles"
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
        {/* Controls Card */}
        <div className="rounded-xl border border-admin-border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="search"
                placeholder="Search articles by title, tag, or excerpt…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2 text-sm text-admin-text transition focus:border-brand-red focus:bg-white focus:outline-none"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter Tabs */}
              <div className="flex rounded-lg border border-admin-border bg-admin-bg p-0.5 text-xs">
                {(['all', 'published', 'draft', 'archived'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-md px-3 py-1.5 font-medium capitalize transition ${
                      statusFilter === st
                        ? 'bg-white text-admin-text shadow-xs'
                        : 'text-admin-muted hover:text-admin-text'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-admin-border bg-white px-3 py-1.5 text-xs text-admin-text focus:border-brand-red focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-lg border border-admin-border bg-white px-3 py-1.5 text-xs text-admin-text focus:border-brand-red focus:outline-none"
              >
                <option value="updated">Recently Updated</option>
                <option value="published">Recently Published</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-white shadow-sm" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              <p className="font-semibold">Failed to load articles</p>
              <p className="mt-1">{error}</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="rounded-xl border border-admin-border bg-white p-12 text-center shadow-sm">
              <p className="font-heading text-lg font-semibold text-admin-text">
                {search || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'No matching articles found'
                  : 'No articles created yet'}
              </p>
              <p className="mt-1 text-xs text-admin-muted">
                {search || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try clearing filters or search query.'
                  : 'Start writing your first technical post in the studio editor.'}
              </p>
              <div className="mt-5">
                <Link
                  to="/articles/new"
                  className="inline-block rounded-lg bg-brand-gradient px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95"
                >
                  Create Article
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-admin-border bg-admin-bg/50 text-xs text-admin-muted">
                    <th className="px-6 py-3 font-medium">Article</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Category / Tags</th>
                    <th className="px-6 py-3 font-medium">Timeline</th>
                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="transition hover:bg-admin-bg/40">
                      {/* Title & Excerpt */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {article.coverImage && (
                            <img
                              src={article.coverImage}
                              alt=""
                              className="h-12 w-16 shrink-0 rounded-md object-cover border border-admin-border"
                            />
                          )}
                          <div className="min-w-0">
                            <Link
                              to={`/articles/${article.id}/edit`}
                              className="font-heading font-semibold text-admin-text hover:text-brand-red transition"
                            >
                              {article.title || 'Untitled Article'}
                            </Link>
                            <p className="mt-0.5 line-clamp-1 text-xs text-admin-muted">
                              {article.excerpt || 'No excerpt provided.'}
                            </p>
                            <p className="mt-1 text-[11px] font-mono text-admin-muted">
                              /{article.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={article.status} />
                      </td>

                      {/* Category & Tags */}
                      <td className="px-6 py-4">
                        <span className="inline-block rounded bg-admin-bg px-2 py-0.5 text-xs font-medium text-admin-text">
                          {article.category || 'Uncategorized'}
                        </span>
                        {article.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] text-admin-muted"
                              >
                                #{tag}
                              </span>
                            ))}
                            {article.tags.length > 3 && (
                              <span className="text-[10px] text-admin-muted">
                                +{article.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Timeline */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-admin-muted">
                        <div>
                          <span className="text-admin-text font-medium">Updated:</span>{' '}
                          {formatDate(article.updatedAt || article.createdAt)}
                        </div>
                        {article.publishedAt && (
                          <div className="mt-0.5">
                            <span>Published:</span> {formatDate(article.publishedAt)}
                          </div>
                        )}
                        <div className="mt-0.5 text-[11px] text-admin-muted">
                          {article.readingTime} min read
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/articles/${article.id}/edit`}
                            className="rounded border border-admin-border bg-white px-2.5 py-1 text-xs font-medium text-admin-text hover:border-brand-red hover:text-brand-red shadow-xs transition"
                          >
                            Edit
                          </Link>

                          {article.status !== 'published' ? (
                            <button
                              type="button"
                              onClick={() => void handleToggleStatus(article, 'published')}
                              className="rounded border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 transition"
                            >
                              Publish
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => void handleToggleStatus(article, 'draft')}
                              className="rounded border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 transition"
                            >
                              Unpublish
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setArticleToDelete(article)}
                            className="rounded border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {articleToDelete && (
        <ConfirmDialog
          title="Delete Article"
          body={`Are you sure you want to permanently delete "${articleToDelete.title || 'Untitled'}"? This action cannot be undone.`}
          confirmLabel={deleting ? 'Deleting…' : 'Delete Article'}
          onConfirm={() => void handleConfirmDelete()}
          onCancel={() => setArticleToDelete(null)}
        />
      )}
    </div>
  );
}
