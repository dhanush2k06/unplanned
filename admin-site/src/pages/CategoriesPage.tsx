import { useEffect, useState, type FormEvent } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Topbar } from '../components/Topbar';
import { useToast } from '../hooks/useToast';
import { deleteCategory, listCategories, saveCategory } from '../services/firebase/cms';
import type { Category } from '../types';
import { slugify } from '../utils/slugify';

export function CategoriesPage() {
  const { notify } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const data = await listCategories();
      setCategories(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function handleOpenCreate() {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setSlugEdited(false);
    setDescription('');
    setIsModalOpen(true);
  }

  function handleOpenEdit(cat: Category) {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setSlugEdited(true);
    setDescription(cat.description);
    setIsModalOpen(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      notify('Please enter a category name.');
      return;
    }

    setSaving(true);
    try {
      const finalSlug = slug.trim() || slugify(name);
      await saveCategory({
        id: editingCategory?.id,
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
      });
      notify(editingCategory ? 'Category updated.' : 'Category created.');
      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      await deleteCategory(categoryToDelete.id);
      notify('Category deleted.');
      setCategoryToDelete(null);
      await loadData();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : 'Failed to delete category.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-full bg-admin-bg pb-12">
      <Topbar
        title="Categories"
        action={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            <span>+</span>
            <span>Add Category</span>
          </button>
        }
      />

      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-white shadow-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p className="font-semibold">Failed to load categories</p>
            <p className="mt-1">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-xl border border-admin-border bg-white p-12 text-center shadow-sm">
            <p className="font-heading text-lg font-semibold text-admin-text">
              No categories configured yet
            </p>
            <p className="mt-1 text-xs text-admin-muted">
              Add topics like Artificial Intelligence, Projects, Web Development to organize your articles.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-block rounded-lg bg-brand-gradient px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95"
              >
                Create First Category
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-admin-border bg-admin-bg/50 text-xs text-admin-muted">
                  <th className="px-6 py-3 font-medium">Category Name</th>
                  <th className="px-6 py-3 font-medium">Slug</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {categories.map((category) => (
                  <tr key={category.id} className="transition hover:bg-admin-bg/40">
                    <td className="px-6 py-4 font-semibold text-admin-text">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-admin-muted">
                      /category/{category.slug}
                    </td>
                    <td className="px-6 py-4 text-xs text-admin-muted">
                      {category.description || '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(category)}
                          className="rounded border border-admin-border bg-white px-2.5 py-1 text-xs font-medium text-admin-text hover:border-brand-red hover:text-brand-red shadow-xs transition"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(category)}
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
      </main>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="font-heading text-lg font-bold text-admin-text">
              {editingCategory ? 'Edit Category' : 'New Category'}
            </h2>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-admin-muted">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slugEdited) setSlug(slugify(e.target.value));
                  }}
                  className="mt-1 w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2 text-sm text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-admin-muted">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. artificial-intelligence"
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setSlugEdited(true);
                  }}
                  className="mt-1 w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2 text-xs font-mono text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-admin-muted">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this topic"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2 text-xs text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-admin-border px-4 py-2 text-xs font-medium text-admin-muted hover:bg-admin-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-brand-gradient px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <ConfirmDialog
          title="Delete Category"
          body={`Are you sure you want to delete "${categoryToDelete.name}"? Articles currently linked to this category won't be deleted, but may show as uncategorized.`}
          confirmLabel={deleting ? 'Deleting…' : 'Delete Category'}
          onConfirm={() => void handleConfirmDelete()}
          onCancel={() => setCategoryToDelete(null)}
        />
      )}
    </div>
  );
}
