import {
  colorDistance,
  computeBlocks,
  effectiveScale,
  MAX_OUTPUT_SIDE,
  nearestColor,
  PixelBuffer,
  Rgb,
  toCssColor,
  toGrayscale,
  transformColor,
} from './pixelator';

type Rgba = [number, number, number, number];

/** Builds a `width`×`height` image where `pixel(x, y)` gives the RGBA of each pixel. */
function image(width: number, height: number, pixel: (x: number, y: number) => Rgba): PixelBuffer {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      data.set(pixel(x, y), (y * width + x) * 4);
    }
  }
  return { width, height, data };
}

describe('computeBlocks', () => {
  it('averages every block', () => {
    const img = image(4, 2, (x) => (x < 2 ? [255, 0, 0, 255] : [0, 0, 255, 255]));

    expect(computeBlocks(img, 2)).toEqual([
      { x: 0, y: 0, width: 2, height: 2, color: [255, 0, 0], opaque: true },
      { x: 2, y: 0, width: 2, height: 2, color: [0, 0, 255], opaque: true },
    ]);
  });

  it('crops the blocks on the right and bottom edges instead of reading outside the image', () => {
    const img = image(5, 3, () => [100, 150, 200, 255]);
    const blocks = computeBlocks(img, 4);

    expect(blocks.map(({ x, y, width, height }) => [x, y, width, height])).toEqual([
      [0, 0, 4, 3],
      [4, 0, 1, 3],
    ]);
    // Before the fix the edge blocks got darker, averaged with "black" pixels outside the image.
    expect(blocks.every((block) => block.color.join() === '100,150,200')).toBe(true);
  });

  it('ignores the color of transparent pixels', () => {
    const img = image(2, 1, (x) => (x === 0 ? [255, 255, 255, 255] : [0, 0, 0, 0]));
    const [block] = computeBlocks(img, 2);

    expect(block.color).toEqual([255, 255, 255]);
  });

  it('marks mostly transparent blocks as not opaque', () => {
    const img = image(2, 2, (x, y) => (x === 0 && y === 0 ? [255, 0, 0, 255] : [0, 0, 0, 0]));

    expect(computeBlocks(img, 2)[0].opaque).toBe(false);
    expect(
      computeBlocks(
        image(1, 1, () => [0, 0, 0, 0]),
        1
      )[0]
    ).toEqual(expect.objectContaining({ color: [0, 0, 0], opaque: false }));
  });

  it('treats sizes below one as one', () => {
    expect(
      computeBlocks(
        image(2, 2, () => [1, 2, 3, 255]),
        0
      )
    ).toHaveLength(4);
  });
});

describe('colors', () => {
  const palette: Rgb[] = [
    [0, 0, 0],
    [255, 255, 255],
    [255, 0, 0],
  ];

  it('finds the nearest palette color', () => {
    expect(nearestColor([20, 10, 10], palette)).toEqual([0, 0, 0]);
    expect(nearestColor([240, 240, 230], palette)).toEqual([255, 255, 255]);
    expect(nearestColor([200, 40, 30], palette)).toEqual([255, 0, 0]);
  });

  it('returns the color itself for an empty palette', () => {
    expect(nearestColor([1, 2, 3], [])).toEqual([1, 2, 3]);
  });

  it('measures zero distance between equal colors', () => {
    expect(colorDistance([10, 20, 30], [10, 20, 30])).toBe(0);
    expect(colorDistance([0, 0, 0], [255, 255, 255])).toBeGreaterThan(colorDistance([0, 0, 0], [128, 128, 128]));
  });

  it('converts to grayscale using luma', () => {
    expect(toGrayscale([255, 255, 255])).toEqual([255, 255, 255]);
    expect(toGrayscale([0, 255, 0])).toEqual([150, 150, 150]);
  });

  it('applies the palette first and grayscale second', () => {
    expect(transformColor([200, 40, 30], { palette, grayscale: false })).toEqual([255, 0, 0]);
    expect(transformColor([200, 40, 30], { palette, grayscale: true })).toEqual([76, 76, 76]);
    expect(transformColor([200, 40, 30], { palette: null, grayscale: false })).toEqual([200, 40, 30]);
  });

  it('formats colors for CSS', () => {
    expect(toCssColor([1, 2, 3])).toBe('rgb(1, 2, 3)');
  });
});

describe('effectiveScale', () => {
  it('keeps the requested scale when the result fits', () => {
    expect(effectiveScale(800, 600, 1.5)).toBe(1.5);
  });

  it('limits the scale so the result fits into a canvas', () => {
    expect(effectiveScale(4096, 100, 4) * 4096).toBe(MAX_OUTPUT_SIDE);
  });
});
