import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { getFirebaseStorage } from './config';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 10 * 1024 * 1024; // 10MB limit

export function validateImageFile(file: File): string | null {
  if (!ALLOWED.has(file.type) && !file.type.startsWith('image/')) {
    return 'Please select a valid image file (JPG, PNG, WebP, or GIF).';
  }
  if (file.size > MAX_BYTES) {
    return 'Image must be smaller than 10MB.';
  }
  return null;
}

/**
 * Resizes and compresses image on the client side using HTML5 Canvas.
 * Produces both an optimized Blob and a base64 Data URL.
 */
export async function compressAndPrepareImage(
  file: File,
  maxDimension = 1600,
  quality = 0.85
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for processing.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ blob: file, dataUrl: String(reader.result) });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try webp compression first, fallback to jpeg if unsupported
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              const fallbackDataUrl = canvas.toDataURL('image/jpeg', quality);
              resolve({ blob: file, dataUrl: fallbackDataUrl });
              return;
            }
            const dataUrl = canvas.toDataURL('image/webp', quality);
            resolve({ blob, dataUrl });
          },
          'image/webp',
          quality
        );
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export type UploadResult = {
  url: string;
  isInlineFallback: boolean;
  message?: string;
};

/**
 * Uploads an image to Firebase Storage with automatic client-side optimization
 * and graceful inline fallback if Firebase Storage is not configured or blocked.
 */
export async function uploadImage(options: {
  path: string;
  file: File;
  onProgress?: (percent: number) => void;
}): Promise<UploadResult> {
  const validationError = validateImageFile(options.file);
  if (validationError) throw new Error(validationError);

  options.onProgress?.(15);
  const { blob, dataUrl } = await compressAndPrepareImage(options.file);
  options.onProgress?.(35);

  try {
    const storageInstance = getFirebaseStorage();
    
    // Ensure file path extension matches webp if converted
    let uploadPath = options.path;
    if (blob.type === 'image/webp' && !uploadPath.endsWith('.webp')) {
      uploadPath = uploadPath.replace(/\.[^/.]+$/, '') + '.webp';
    }

    const storageRef = ref(storageInstance, uploadPath);
    const task = uploadBytesResumable(storageRef, blob, {
      contentType: blob.type || 'image/webp',
    });

    await new Promise<void>((resolve, reject) => {
      task.on(
        'state_changed',
        (snapshot) => {
          const rawPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 60;
          options.onProgress?.(Math.min(95, Math.round(35 + rawPercent)));
        },
        reject,
        () => resolve()
      );
    });

    const downloadUrl = await getDownloadURL(task.snapshot.ref);
    options.onProgress?.(100);
    return { url: downloadUrl, isInlineFallback: false };
  } catch (err: unknown) {
    console.warn(
      'Firebase Storage upload was unavailable or rejected. Using optimized inline fallback.',
      err
    );

    // Graceful fallback to the optimized inline data URL
    options.onProgress?.(100);
    return {
      url: dataUrl,
      isInlineFallback: true,
      message: 'Cloud Storage was unreachable. Image saved inline.',
    };
  }
}
