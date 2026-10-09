import { Rgb } from './pixelator';

export interface Palette {
  name: string;
  /** `null` means "keep the original colors". */
  colors: readonly Rgb[] | null;
}

function hex(...values: string[]): Rgb[] {
  return values.map((value) => {
    const n = parseInt(value.replace('#', ''), 16);
    return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff] as const;
  });
}

export const PALETTES: readonly Palette[] = [
  { name: 'Original', colors: null },
  {
    name: 'Wool',
    colors: [
      [221, 221, 221], // white
      [219, 125, 62], // orange
      [179, 80, 188], // magenta
      [107, 138, 201], // light blue
      [177, 166, 39], // yellow
      [65, 174, 56], // lime
      [208, 132, 153], // pink
      [64, 64, 64], // dark gray
      [154, 161, 161], // light gray
      [46, 110, 137], // cyan
      [126, 61, 161], // purple
      [46, 56, 141], // blue
      [79, 50, 31], // brown
      [53, 70, 27], // green
      [150, 52, 48], // red
      [25, 22, 22], // black
    ],
  },
  {
    name: 'Retro',
    colors: [
      [110, 184, 168],
      [42, 88, 79],
      [116, 163, 63],
      [252, 255, 192],
      [198, 80, 90],
      [47, 20, 47],
      [119, 68, 72],
      [238, 156, 93],
    ],
  },
  {
    name: 'PICO-8',
    colors: hex(
      '#000000',
      '#1d2b53',
      '#7e2553',
      '#008751',
      '#ab5236',
      '#5f574f',
      '#c2c3c7',
      '#fff1e8',
      '#ff004d',
      '#ffa300',
      '#ffec27',
      '#00e436',
      '#29adff',
      '#83769c',
      '#ff77a8',
      '#ffccaa'
    ),
  },
  { name: 'Game Boy', colors: hex('#0f380f', '#306230', '#8bac0f', '#9bbc0f') },
  { name: 'CGA', colors: hex('#000000', '#55ffff', '#ff55ff', '#ffffff') },
  { name: '1-bit', colors: hex('#000000', '#ffffff') },
];
