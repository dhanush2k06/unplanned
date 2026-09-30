import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { getFirebaseStorage } from './config';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED.has(file.type)) return 'Use a JPG, PNG, or WebP image.';
  if (file.size > MAX_BYTES) return 'Images must be smaller than 5MB.';
  return null;
}

export async function maybeConvertToWebP(file: File): Promise<Blob> {
  if (file.type === 'image/webp' || file.type === 'image/png') return file;
  if (typeof createImageBitmap !== 'function') return file;

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext('2d');
  if (!context) return file;
  context.drawImage(bitmap, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), 'image/webp', 0.86);
  });
  return blob ?? file;
}

export async function uploadImage(options: {
  path: string;
  file: File;
  onProgress?: (percent: number) => void;
}): Promise<string> {
  const error = validateImageFile(options.file);
  if (error) throw new Error(error);

  const blob = await maybeConvertToWebP(options.file);
  const storageRef = ref(getFirebaseStorage(), options.path);
  const task = uploadBytesResumable(storageRef, blob, {
    contentType: blob.type || 'image/webp',
  });

  await new Promise<void>((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        options.onProgress?.(percent);
      },
      reject,
      () => resolve(),
    );
  });

  return getDownloadURL(task.snapshot.ref);
}
