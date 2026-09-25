/** Larger images are downscaled on load: pixel art doesn't need more, and it keeps rendering snappy. */
export const MAX_SOURCE_SIDE = 2048;

export class ImageLoadError extends Error {
  override name = 'ImageLoadError';
}

/** Decodes an image file and returns its pixels, downscaled to fit into `maxSide`. */
export async function loadImageData(file: Blob, maxSide = MAX_SOURCE_SIDE): Promise<ImageData> {
  if (!file.type.startsWith('image/')) {
    throw new ImageLoadError('This file is not an image');
  }

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode().catch(() => {
      throw new ImageLoadError('Could not read this image');
    });

    const { naturalWidth: width, naturalHeight: height } = img;
    if (!width || !height) {
      throw new ImageLoadError('This image has no size');
    }

    const ratio = Math.min(1, maxSide / Math.max(width, height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new ImageLoadError('2D canvas context is not supported');
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  } finally {
    URL.revokeObjectURL(url);
  }
}
