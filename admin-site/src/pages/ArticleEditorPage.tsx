import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ImageUploader } from '../components/ImageUploader';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { SaveIndicator } from '../components/SaveIndicator';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import {
  createArticle,
  deleteArticle,
  getArticle,
  listCategories,
  slugTaken,
  updateArticle,
} from '../services/firebase/cms';
import type { ArticleDraftInput, ArticleStatus, Category } from '../types';
import { relativeTime } from '../utils/dates';
import { estimateReadingTime } from '../utils/readingTime';
import { slugify } from '../utils/slugify';

type ViewMode = 'editor' | 'split' | 'preview';

export function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { notify } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<ArticleStatus>('draft');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // Save / Auto-save State
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [relativeSaveTime, setRelativeSaveTime] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);
  const [savingAction, setSavingAction] = useState(false);

  // Modals & Navigation protection
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<number | null>(null);

  // Load Categories & Existing Article
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const catList = await listCategories();
        if (mounted) {
          setCategories(catList);
          if (catList.length > 0 && !category) {
            setCategory(catList[0].name);
          }
        }

        if (id) {
          const existing = await getArticle(id);
          if (mounted && existing) {
            setTitle(existing.title);
            setSlug(existing.slug);
            setSlugManuallyEdited(true);
            setExcerpt(existing.excerpt);
            setContent(existing.content);
            setCoverImage(existing.coverImage);
            setStatus(existing.status);
            setCategory(existing.category);
            setTags(existing.tags || []);
            setSeoTitle(existing.seoTitle || '');
            setSeoDescription(existing.seoDescription || '');
            setCanonicalUrl(existing.canonicalUrl || '');
            setIsDirty(false);
            setSaveStatus('saved');
            setLastSavedAt(new Date());
          }
        }
      } catch (err: unknown) {
        notify(err instanceof Error ? err.message : 'Error loading article.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void init();
    return () => {
      mounted = false;
    };
  }, [id, notify]);

  // Relative save time ticker
  useEffect(() => {
    if (!lastSavedAt) return;
    const interval = window.setInterval(() => {
      setRelativeSaveTime(relativeTime(lastSavedAt));
    }, 10000);
    setRelativeSaveTime(relativeTime(lastSavedAt));
    return () => window.clearInterval(interval);
  }, [lastSavedAt]);

  // Prompt before leaving tab with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Handle title change & auto-generate slug
  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    const nextTitle = e.target.value;
    setTitle(nextTitle);
    setIsDirty(true);
    if (!slugManuallyEdited) {
      setSlug(slugify(nextTitle));
    }
  }

  // Tag management
  function handleAddTag() {
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
      setIsDirty(true);
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    setTags(tags.filter((t) => t !== tagToRemove));
    setIsDirty(true);
  }

  // Quick Markdown toolbar inserter
  function insertMarkdown(prefix: string, suffix = '', placeholder = '') {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || placeholder;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    setContent(newContent);
    setIsDirty(true);

    window.setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length,
      );
    }, 0);
  }

  // Auto-Save effect for editing existing articles
  useEffect(() => {
    if (!id || !isDirty) return;

    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = window.setTimeout(async () => {
      if (!title.trim()) return;
      try {
        setSaveStatus('saving');
        const selectedCat = categories.find((c) => c.name === category);
        const input: Partial<ArticleDraftInput> = {
          title,
          slug: slug || slugify(title),
          excerpt,
          content,
          coverImage,
          category,
          categorySlug: selectedCat?.slug || slugify(category),
          tags,
          readingTime: estimateReadingTime(content),
          seoTitle: seoTitle || title,
          seoDescription: seoDescription || excerpt,
          canonicalUrl,
        };
        await updateArticle(id, input);
        setIsDirty(false);
        setSaveStatus('saved');
        setLastSavedAt(new Date());
      } catch {
        setSaveStatus('error');
      }
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [
    id,
    isDirty,
    title,
    slug,
    excerpt,
    content,
    coverImage,
    category,
    categories,
    tags,
    seoTitle,
    seoDescription,
    canonicalUrl,
  ]);

  // Main Save / Publish handler
  async function handleSave(targetStatus?: ArticleStatus) {
    if (!title.trim()) {
      notify('Please provide an article title.');
      return;
    }

    const currentStatus = targetStatus || status;
    const finalSlug = slug.trim() || slugify(title);

    // Verify slug uniqueness
    try {
      const taken = await slugTaken(finalSlug, id);
      if (taken) {
        notify('Slug is already in use by another article. Please change it.');
        return;
      }
    } catch {
      // Continue if offline/unconfigured check fails
    }

    setSavingAction(true);
    setSaveStatus('saving');

    const selectedCat = categories.find((c) => c.name === category);
    const readingTime = estimateReadingTime(content);

    const inputData: ArticleDraftInput = {
      title,
      slug: finalSlug,
      excerpt,
      content,
      coverImage,
      status: currentStatus,
      category: category || (categories[0]?.name ?? 'General'),
      categorySlug: selectedCat?.slug || slugify(category || 'General'),
      tags,
      readingTime,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      canonicalUrl,
    };

    try {
      if (id) {
        await updateArticle(id, { ...inputData, status: currentStatus });
        setStatus(currentStatus);
        setIsDirty(false);
        setSaveStatus('saved');
        setLastSavedAt(new Date());
        notify(
          currentStatus === 'published'
            ? 'Article published successfully!'
            : 'Article changes saved.',
        );
      } else {
        const authorId = user?.uid || 'admin';
        const authorName = profile?.name || user?.displayName || 'Author';
        const newId = await createArticle(inputData, {
          id: authorId,
          name: authorName,
        });
        setIsDirty(false);
        notify(
          currentStatus === 'published'
            ? 'Article published successfully!'
            : 'Draft article created.',
        );
        navigate(`/articles/${newId}/edit`, { replace: true });
      }
    } catch (err: unknown) {
      setSaveStatus('error');
      notify(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSavingAction(false);
    }
  }

  // Delete handler
  async function handleDelete() {
    if (!id) return;
    try {
      await deleteArticle(id);
      notify('Article deleted.');
      navigate('/articles', { replace: true });
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : 'Failed to delete article.');
    }
  }

  // Safe navigation interceptor
  function handleSafeNavigate(to: string) {
    if (isDirty) {
      setPendingNavigation(to);
      setShowLeaveModal(true);
    } else {
      navigate(to);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-admin-bg p-12 text-sm text-admin-muted">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
          <p className="mt-3">Loading article studio…</p>
        </div>
      </div>
    );
  }

  const calculatedReadingTime = estimateReadingTime(content);
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex min-h-svh flex-col bg-admin-bg">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-admin-border bg-white px-6 py-3.5 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleSafeNavigate('/articles')}
            className="rounded-lg border border-admin-border px-3 py-1.5 text-xs font-medium text-admin-muted transition hover:bg-admin-bg hover:text-admin-text"
          >
            ← Back
          </button>
          <div className="hidden sm:block">
            <h1 className="font-heading text-sm font-semibold text-admin-text truncate max-w-xs md:max-w-md">
              {title || 'Untitled Draft'}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-admin-muted">
              <span className="capitalize">{status}</span>
              <span>•</span>
              <SaveIndicator status={saveStatus} relative={relativeSaveTime} />
            </div>
          </div>
        </div>

        {/* View Mode Controls & Primary Actions */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="hidden md:flex rounded-lg border border-admin-border bg-admin-bg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`rounded px-2.5 py-1 transition ${
                viewMode === 'editor'
                  ? 'bg-white font-medium text-admin-text shadow-xs'
                  : 'text-admin-muted hover:text-admin-text'
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`rounded px-2.5 py-1 transition ${
                viewMode === 'split'
                  ? 'bg-white font-medium text-admin-text shadow-xs'
                  : 'text-admin-muted hover:text-admin-text'
              }`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`rounded px-2.5 py-1 transition ${
                viewMode === 'preview'
                  ? 'bg-white font-medium text-admin-text shadow-xs'
                  : 'text-admin-muted hover:text-admin-text'
              }`}
            >
              Preview
            </button>
          </div>

          {/* Action Buttons */}
          <button
            type="button"
            disabled={savingAction}
            onClick={() => void handleSave('draft')}
            className="rounded-lg border border-admin-border bg-white px-3.5 py-2 text-xs font-semibold text-admin-text shadow-xs transition hover:bg-admin-bg disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={savingAction}
            onClick={() => void handleSave('published')}
            className="rounded-lg bg-brand-gradient px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-50"
          >
            {savingAction ? 'Publishing…' : status === 'published' ? 'Update & Publish' : 'Publish'}
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Left / Center: Editor and Split Preview */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-admin-border">
          {/* Article Title & Slug Bar */}
          <div className="border-b border-admin-border p-6 space-y-4">
            <input
              type="text"
              placeholder="Article title…"
              value={title}
              onChange={handleTitleChange}
              className="w-full font-heading text-2xl sm:text-3xl font-bold tracking-tight text-admin-text placeholder-neutral-300 focus:outline-none"
            />

            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-admin-muted">/articles/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugManuallyEdited(true);
                  setIsDirty(true);
                }}
                placeholder="url-slug"
                className="flex-1 font-mono text-xs rounded border border-admin-border bg-admin-bg px-2 py-1 text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Markdown Formatting Toolbar */}
          {(viewMode === 'editor' || viewMode === 'split') && (
            <div className="flex flex-wrap items-center gap-1 border-b border-admin-border bg-admin-bg/60 px-6 py-2 text-xs text-admin-muted">
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**', 'bold text')}
                className="rounded px-2 py-1 font-bold hover:bg-white hover:text-admin-text"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('*', '*', 'italic text')}
                className="rounded px-2 py-1 italic hover:bg-white hover:text-admin-text"
                title="Italic"
              >
                I
              </button>
              <div className="h-4 w-px bg-admin-border" />
              <button
                type="button"
                onClick={() => insertMarkdown('## ', '\n', 'Heading 2')}
                className="rounded px-2 py-1 font-semibold hover:bg-white hover:text-admin-text"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('### ', '\n', 'Heading 3')}
                className="rounded px-2 py-1 font-semibold hover:bg-white hover:text-admin-text"
                title="Heading 3"
              >
                H3
              </button>
              <div className="h-4 w-px bg-admin-border" />
              <button
                type="button"
                onClick={() => insertMarkdown('[', '](https://)', 'Link text')}
                className="rounded px-2 py-1 hover:bg-white hover:text-admin-text"
                title="Link"
              >
                Link
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('![', '](https://)', 'Image alt')}
                className="rounded px-2 py-1 hover:bg-white hover:text-admin-text"
                title="Image"
              >
                Image
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('```javascript\n', '\n```\n', '// code here')}
                className="rounded px-2 py-1 font-mono hover:bg-white hover:text-admin-text"
                title="Code Block"
              >
                &lt;/&gt;
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('> ', '\n', 'Blockquote')}
                className="rounded px-2 py-1 hover:bg-white hover:text-admin-text"
                title="Quote"
              >
                Quote
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('- ', '\n', 'List item')}
                className="rounded px-2 py-1 hover:bg-white hover:text-admin-text"
                title="Bullet List"
              >
                List
              </button>
              <button
                type="button"
                onClick={() =>
                  insertMarkdown(
                    '| Column 1 | Column 2 |\n|---|---|\n| Item 1 | Item 2 |\n',
                  )
                }
                className="rounded px-2 py-1 hover:bg-white hover:text-admin-text"
                title="Table"
              >
                Table
              </button>

              <div className="ml-auto flex items-center gap-3 text-[11px]">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{calculatedReadingTime} min read</span>
              </div>
            </div>
          )}

          {/* Editor & Preview Area */}
          <div className="flex-1 flex flex-col md:flex-row min-h-[500px]">
            {/* Editor Textarea */}
            {(viewMode === 'editor' || viewMode === 'split') && (
              <div className="flex-1 flex flex-col p-6">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Write your article in Markdown..."
                  className="flex-1 w-full resize-none font-mono text-sm leading-relaxed text-admin-text placeholder-neutral-300 focus:outline-none"
                  rows={25}
                />
              </div>
            )}

            {/* Split / Live Preview Pane with Public Dark Theme Simulation */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="flex-1 border-t md:border-t-0 md:border-l border-admin-border bg-[#0d0d0d] p-8 overflow-y-auto max-h-[85vh]">
                <div className="mx-auto max-w-[720px]">
                  <div className="mb-4 text-xs font-mono uppercase tracking-wider text-neutral-500">
                    Public Preview
                  </div>
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt=""
                      className="mb-8 h-64 w-full rounded-xl object-cover border border-neutral-800"
                    />
                  )}
                  <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                    {title || 'Article Title'}
                  </h1>
                  {excerpt && (
                    <p className="text-lg text-neutral-400 font-serif italic mb-6 border-b border-neutral-800 pb-6">
                      {excerpt}
                    </p>
                  )}
                  {content ? (
                    <MarkdownRenderer content={content} />
                  ) : (
                    <p className="text-sm text-neutral-600 italic">
                      Article body content will render here in real-time…
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Metadata & Publishing Controls */}
        <aside className="w-full lg:w-80 shrink-0 bg-admin-bg p-6 space-y-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-admin-border">
          {/* Status & Lifecycle Card */}
          <div className="rounded-xl border border-admin-border bg-white p-5 shadow-xs space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-admin-muted">
              Publishing Status
            </h3>

            <div>
              <label className="block text-xs font-medium text-admin-muted mb-1.5">
                Visibility Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as ArticleStatus);
                  setIsDirty(true);
                }}
                className="w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-admin-muted mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div className="rounded-xl border border-admin-border bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-heading text-xs font-bold uppercase tracking-wider text-admin-muted">
                Article Excerpt
              </label>
              <span className="text-[11px] text-admin-muted">{excerpt.length} chars</span>
            </div>
            <p className="text-[11px] text-admin-muted">
              Short summary displayed on cards and search results.
            </p>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Provide a compelling summary of this article…"
              className="w-full rounded-lg border border-admin-border bg-admin-bg p-3 text-xs leading-relaxed text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
            />
          </div>

          {/* Cover Image */}
          <div className="rounded-xl border border-admin-border bg-white p-5 shadow-xs space-y-3">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-admin-muted">
              Cover Image
            </h3>
            <ImageUploader
              label="Article Cover"
              value={coverImage}
              pathPrefix="article-covers"
              onChange={(url) => {
                setCoverImage(url);
                setIsDirty(true);
              }}
            />
            {coverImage && (
              <button
                type="button"
                onClick={() => {
                  setCoverImage('');
                  setIsDirty(true);
                }}
                className="text-xs text-red-600 hover:underline"
              >
                Remove Cover Image
              </button>
            )}
          </div>

          {/* Tags Manager */}
          <div className="rounded-xl border border-admin-border bg-white p-5 shadow-xs space-y-3">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-admin-muted">
              Tags
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag (e.g. AI, React)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 rounded-lg border border-admin-border bg-admin-bg px-3 py-1.5 text-xs text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-lg border border-admin-border bg-white px-3 py-1.5 text-xs font-medium text-admin-text hover:bg-admin-bg"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-admin-bg px-2.5 py-1 text-xs font-medium text-admin-text"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-admin-muted hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO Metadata Card */}
          <div className="rounded-xl border border-admin-border bg-white p-5 shadow-xs space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-admin-muted">
              SEO & Social Metadata
            </h3>

            <div>
              <label className="block text-xs font-medium text-admin-muted mb-1">
                SEO Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => {
                  setSeoTitle(e.target.value);
                  setIsDirty(true);
                }}
                placeholder={title || 'Custom meta title'}
                className="w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-1.5 text-xs text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-admin-muted mb-1">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => {
                  setSeoDescription(e.target.value);
                  setIsDirty(true);
                }}
                placeholder={excerpt || 'Meta description for search engines'}
                className="w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-1.5 text-xs text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-admin-muted mb-1">
                Canonical URL
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => {
                  setCanonicalUrl(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="https://yourdomain.com/articles/..."
                className="w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-1.5 text-xs text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Danger Zone: Delete Article */}
          {isEditing && (
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-700">
                Danger Zone
              </h3>
              <p className="mt-1 text-xs text-red-600">
                Permanently remove this article from the database and storage.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="mt-3 w-full rounded-lg border border-red-300 bg-white py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                Delete Article
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmDialog
          title="Delete Article"
          body="Are you sure you want to permanently delete this article? This action cannot be reversed."
          confirmLabel="Delete Article"
          onConfirm={() => void handleDelete()}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* Unsaved Changes Leave Modal */}
      {showLeaveModal && (
        <ConfirmDialog
          title="Unsaved Changes"
          body="You have unsaved changes in this article. Are you sure you want to leave without saving?"
          confirmLabel="Leave without Saving"
          onConfirm={() => {
            setShowLeaveModal(false);
            if (pendingNavigation) navigate(pendingNavigation);
          }}
          onCancel={() => {
            setShowLeaveModal(false);
            setPendingNavigation(null);
          }}
        />
      )}
    </div>
  );
}
