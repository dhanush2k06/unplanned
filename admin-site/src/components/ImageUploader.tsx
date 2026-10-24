import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { uploadImage, validateImageFile } from '../services/firebase/storage';

type Props = {
  label: string;
  value: string;
  pathPrefix: string;
  onChange: (url: string) => void;
};

export function ImageUploader({ label, value, pathPrefix, onChange }: Props) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileProcess(file: File | undefined) {
    if (!file) return;

    const invalid = validateImageFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }

    setError(null);
    setNotice(null);
    setProgress(5);

    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const result = await uploadImage({
        path: `${pathPrefix}/${Date.now()}_${sanitizedName}`,
        file,
        onProgress: (pct) => setProgress(pct),
      });

      onChange(result.url);

      if (result.isInlineFallback) {
        setNotice(result.message || 'Image optimized and stored inline.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Image processing failed.');
    } finally {
      setProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    void handleFileProcess(e.target.files?.[0]);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    void handleFileProcess(droppedFile);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleApplyUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError('Please enter a valid image URL.');
      return;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setError('Image URL must start with https:// or http://');
      return;
    }

    setError(null);
    setNotice(null);
    onChange(trimmed);
    setUrlInput('');
  }

  function handleRemove() {
    onChange('');
    setError(null);
    setNotice(null);
    setUrlInput('');
  }

  return (
    <div className="space-y-2.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-admin-muted">
            {label}
          </label>
          {value && (
            <span className="text-[11px] text-emerald-600 font-medium">✓ Image Attached</span>
          )}
        </div>
      )}

      {/* Existing Image Preview */}
      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-admin-border bg-neutral-900 shadow-xs">
          <img
            src={value}
            alt="Cover preview"
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            onError={() => setError('Failed to load image preview. Please check the URL.')}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-md backdrop-blur-sm transition hover:bg-white"
            >
              Replace File
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg bg-red-600/90 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm transition hover:bg-red-600"
            >
              Remove
            </button>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white/90 hover:bg-red-600 transition md:hidden"
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('upload');
                setError(null);
              }}
              className={`flex-1 rounded py-1.5 font-medium transition ${
                mode === 'upload'
                  ? 'bg-white text-admin-text shadow-xs'
                  : 'text-admin-muted hover:text-admin-text'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('url');
                setError(null);
              }}
              className={`flex-1 rounded py-1.5 font-medium transition ${
                mode === 'url'
                  ? 'bg-white text-admin-text shadow-xs'
                  : 'text-admin-muted hover:text-admin-text'
              }`}
            >
              Image URL
            </button>
          </div>

          {mode === 'upload' ? (
            /* Drag & Drop File Zone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
                isDragging
                  ? 'border-brand-red bg-red-50/50'
                  : 'border-admin-border bg-admin-bg/40 hover:border-neutral-400 hover:bg-admin-bg'
              }`}
            >
              <svg
                className="h-8 w-8 text-admin-muted mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs font-semibold text-admin-text">
                Click to browse <span className="font-normal text-admin-muted">or drag & drop</span>
              </p>
              <p className="mt-1 text-[11px] text-admin-muted">
                JPG, PNG, WebP, GIF (up to 10MB)
              </p>
            </div>
          ) : (
            /* URL Input Field */
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/cover.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyUrl();
                    }
                  }}
                  className="flex-1 rounded-lg border border-admin-border bg-admin-bg px-3 py-1.5 text-xs text-admin-text placeholder-neutral-400 focus:border-brand-red focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition"
                >
                  Set URL
                </button>
              </div>
              <p className="text-[11px] text-admin-muted">
                Paste any hosted image URL (e.g., Unsplash, Cloudinary, Imgur).
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Progress Bar */}
      {progress !== null && (
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-admin-muted">
            <span>Processing & uploading…</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full bg-brand-red transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Informative notice */}
      {notice && (
        <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200/80 px-2.5 py-1.5 text-[11px] text-amber-800">
          <span>ℹ️</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-2.5 py-1.5 text-[11px] text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-800 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
