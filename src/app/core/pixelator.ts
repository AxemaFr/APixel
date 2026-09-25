/**
 * APixel - convert an image to pixel art, optionally in grayscale and/or reduced to a color palette.
 * @author Artem Myazitov @ <https://github.com/AxemaFr/APixel>
 */

export type Rgb = readonly [r: number, g: number, b: number];

/** Anything that looks like `ImageData`: a width, a height and RGBA bytes. */
export interface PixelBuffer {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray;
}

export interface PixelateOptions {
  /** Side of a single "big pixel" in source pixels. */
  pixelSize: number;
  /** Size of the result relative to the source (1 = same size). */
  scale: number;
  /** Colors to snap to, or `null` to keep the original colors. */
  palette: readonly Rgb[] | null;
  grayscale: boolean;
  /** Leave a thin gap between pixels, like a LED screen. */
  grid: boolean;
}

/** One averaged block of the source image. Coordinates are in source pixels. */
export interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  color: Rgb;
  /** `false` when the block is mostly transparent and should not be painted. */
  opaque: boolean;
}

/** Browsers refuse to allocate canvases much larger than this. */
export const MAX_OUTPUT_SIDE = 8192;

/**
 * Splits the image into `pixelSize`×`pixelSize` blocks and averages each of them.
 * Blocks on the right/bottom edges are cropped to the image bounds, and transparent
 * pixels do not contribute to the color, so edges and PNG cutouts keep their colors.
 */
export function computeBlocks(image: PixelBuffer, pixelSize: number): Block[] {
  const size = Math.max(1, Math.floor(pixelSize));
  const { width, height, data } = image;
  const blocks: Block[] = [];

  for (let y = 0; y < height; y += size) {
    const blockHeight = Math.min(size, height - y);

    for (let x = 0; x < width; x += size) {
      const blockWidth = Math.min(size, width - x);
      let r = 0;
      let g = 0;
      let b = 0;
      let alpha = 0;

      for (let py = y; py < y + blockHeight; py++) {
        let i = (py * width + x) * 4;
        for (let px = 0; px < blockWidth; px++, i += 4) {
          const a = data[i + 3];
          r += data[i] * a;
          g += data[i + 1] * a;
          b += data[i + 2] * a;
          alpha += a;
        }
      }

      const color: Rgb = alpha > 0 ? [Math.round(r / alpha), Math.round(g / alpha), Math.round(b / alpha)] : [0, 0, 0];
      const opaque = alpha / (blockWidth * blockHeight) >= 128;

      blocks.push({ x, y, width: blockWidth, height: blockHeight, color, opaque });
    }
  }

  return blocks;
}

/**
 * Perceptual-ish distance between two colors ("redmean" approximation),
 * noticeably better than plain euclidean RGB at a negligible cost.
 * @see https://www.compuphase.com/cmetric.htm
 */
export function colorDistance([r1, g1, b1]: Rgb, [r2, g2, b2]: Rgb): number {
  const rMean = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;

  return Math.sqrt((2 + rMean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rMean) / 256) * db * db);
}

export function nearestColor(color: Rgb, palette: readonly Rgb[]): Rgb {
  let best = palette[0] ?? color;
  let bestDistance = Infinity;

  for (const candidate of palette) {
    const distance = colorDistance(color, candidate);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }

  return best;
}

/** Luma (ITU-R BT.601), which looks much more natural than a plain (r + g + b) / 3. */
export function toGrayscale([r, g, b]: Rgb): Rgb {
  const luma = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  return [luma, luma, luma];
}

export function transformColor(
  color: Rgb,
  { palette, grayscale }: Pick<PixelateOptions, 'palette' | 'grayscale'>
): Rgb {
  let result = palette?.length ? nearestColor(color, palette) : color;
  if (grayscale) {
    result = toGrayscale(result);
  }
  return result;
}

/** Keeps the output canvas within the limits browsers can actually allocate. */
export function effectiveScale(width: number, height: number, scale: number): number {
  const maxScale = MAX_OUTPUT_SIDE / Math.max(width, height, 1);
  return Math.max(0.01, Math.min(scale, maxScale));
}

export function toCssColor([r, g, b]: Rgb): string {
  return `rgb(${r}, ${g}, ${b})`;
}

/** Renders the pixelated version of `source` into the `target` canvas (resizing it). */
export function renderPixelArt(target: HTMLCanvasElement, source: PixelBuffer, options: PixelateOptions): void {
  const ctx = target.getContext('2d');
  if (!ctx) {
    throw new Error('2D canvas context is not supported');
  }

  const scale = effectiveScale(source.width, source.height, options.scale);
  target.width = Math.max(1, Math.round(source.width * scale));
  target.height = Math.max(1, Math.round(source.height * scale));
  ctx.clearRect(0, 0, target.width, target.height);

  const cellSize = Math.max(1, Math.floor(options.pixelSize)) * scale;
  const gap = options.grid && cellSize >= 3 ? Math.max(1, Math.round(cellSize * 0.12)) : 0;

  for (const block of computeBlocks(source, options.pixelSize)) {
    if (!block.opaque) {
      continue;
    }

    // Computing both edges from source coordinates avoids gaps/overlaps caused by rounding.
    const x0 = Math.round(block.x * scale);
    const y0 = Math.round(block.y * scale);
    const x1 = Math.round((block.x + block.width) * scale);
    const y1 = Math.round((block.y + block.height) * scale);

    ctx.fillStyle = toCssColor(transformColor(block.color, options));
    ctx.fillRect(x0, y0, Math.max(1, x1 - x0 - gap), Math.max(1, y1 - y0 - gap));
  }
}
