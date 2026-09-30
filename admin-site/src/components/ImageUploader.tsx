import { useState } from 'react';
import { uploadImage, validateImageFile } from '../services/firebase/storage';

type Props = {
  label: string;
  value: string;
  pathPrefix: string;
  onChange: (url: string) => void;
};

export function ImageUploader({ label, value, pathPrefix, onChange }: Props) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    const invalid = validateImageFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError(null);
    setProgress(0);
    try {
      const url = await uploadImage({
        path: `${pathPrefix}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`,
        file,
        onProgress: setProgress,
      });
      onChange(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Upload failed.');
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {value ? (
        <img src={value} alt="" className="h-32 w-full rounded-lg object-cover" />
      ) : (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-admin-border text-sm text-admin-muted">
          No image
        </div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => void onFile(event.target.files?.[0])}
      />
      {progress !== null ? (
        <p className="text-xs text-admin-muted" aria-live="polite">
          Uploading {progress}%
        </p>
      ) : null}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
